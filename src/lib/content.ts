import versionsJson from "@/content/versions.json";
import GithubSlugger from "github-slugger";

export type Version = { id: string; label: string; status: "current" | "archived" };
export const versions = versionsJson as Version[];
export const currentVersion: Version = versions.find((v) => v.status === "current") ?? versions[0]!;
export const getVersion = (id: string) => versions.find((v) => v.id === id);

const files = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** path relative to src/content without extension, e.g. "spec/0.3.1" */
export function getDoc(path: string): string | undefined {
  return files[`/src/content/${path}.md`];
}

export type TocItem = { depth: 2 | 3; text: string; id: string };

/** Extract h2/h3 headings; ids match rehype-slug (github-slugger). */
export function getToc(md: string): TocItem[] {
  const slugger = new GithubSlugger();
  const out: TocItem[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    const id = slugger.slug(text);
    const depth = m[1].length;
    if (depth === 2 || depth === 3) out.push({ depth, text, id });
  }
  return out;
}
