import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const port = 4173;
const base = `http://127.0.0.1:${port}`;
const installedChromium = "/opt/pw-browsers/chromium";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = [process.env.CHROME_PATH, installedChromium, chrome].find(
  (candidate) => candidate && existsSync(candidate),
);

const pages = [
  "/",
  "/spec/0.3.2",
  "/alpha/quick-start",
  "/research",
  "/decisions",
  "/calculator",
] as const;

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 40_000) {
    try {
      const response = await fetch(base);
      if (response.status < 500) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error("dev server did not start");
}

async function audit(page: Page, path: string, theme: "light" | "dark", tab?: string) {
  await page.addInitScript((mode) => {
    localStorage.setItem("theme", mode);
  }, theme);
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate((mode) => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, theme);
  if (tab && tab !== "example") await page.getByRole("tab", { name: tab }).click();
  if (tab === "example") {
    await page.getByRole("tab", { name: "Quick estimate" }).click();
    await page.getByRole("button", { name: "Try example: authentication" }).click();
    await expectClean(page);
    await page.getByRole("tab", { name: "Full SLICE forecast" }).click();
    await page.getByRole("button", { name: "Try example: authentication" }).click();
  }
  await expectClean(page);
}

async function expectClean(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
}

describe.skipIf(!executablePath)(
  executablePath
    ? "accessibility"
    : "accessibility (skipped: no Chrome binary; set CHROME_PATH or install Google Chrome)",
  () => {
    let server: ChildProcess;
    let browser: Browser;

    beforeAll(async () => {
      if (!executablePath)
        throw new Error(
          "No Chrome binary. Set CHROME_PATH, or install Chromium at /opt/pw-browsers/chromium or Google Chrome.",
        );
      server = spawn(
        "bun",
        ["x", "vite", "dev", "--port", String(port), "--strictPort", "--host", "127.0.0.1"],
        {
          stdio: "ignore",
        },
      );
      await waitForServer();
      browser = await chromium.launch({
        headless: true,
        executablePath,
      });
    }, 60_000);

    afterAll(async () => {
      await browser?.close();
      server?.kill();
    });

    it.each(
      pages.flatMap((path) => (["light", "dark"] as const).map((theme) => ({ path, theme }))),
    )(
      "$path in $theme mode has no serious or critical axe violations",
      async ({ path, theme }) => {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();
        await audit(page, path, theme);
        if (path === "/calculator") {
          await audit(page, path, theme, "Full SLICE forecast");
          await audit(page, path, theme, "example");
        }
        await context.close();
      },
      120_000,
    );
  },
);
