import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://sliceframework.org";

function markdownPages(folder: string, prefix: string) {
  return readdirSync(join(root, "src/content", folder))
    .filter((name) => name.endsWith(".md"))
    .map((name) => `${prefix}/${name.slice(0, -3)}`)
    .sort();
}

const versions = JSON.parse(readFileSync(join(root, "src/content/versions.json"), "utf8")) as {
  id: string;
}[];
const paths = [
  "/",
  ...versions.map((version) => `/spec/${version.id}`),
  ...markdownPages("alpha", "/alpha"),
  ...markdownPages("research", "/research"),
  "/changelog",
  "/decisions",
  "/calculator",
];
const urls = paths.map((path) => `  <url><loc>${origin}${path === "/" ? "/" : path}</loc></url>`);
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
  "",
].join("\n");

writeFileSync(join(root, "public/sitemap.xml"), xml);
