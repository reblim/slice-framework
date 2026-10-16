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

/** Discover direct markdown children without maintaining a second content registry. */
export function listDocs(folder: string): { page: string; title: string }[] {
  return documentsInFolder(files, folder);
}

export function documentsInFolder(sources: Record<string, string>, folder: string): { page: string; title: string }[] {
  const prefix = `/src/content/${folder}/`;
  return Object.entries(sources).flatMap(([path, source]) => {
    if (!path.startsWith(prefix) || !path.endsWith(".md")) return [];
    const filename = path.slice(prefix.length);
    if (filename.includes("/")) return [];
    const page = filename.slice(0, -3);
    let fence: string | undefined;
    let previous = "";
    for (const line of source.split("\n")) {
      const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
      if (marker) {
        if (!fence) fence = marker;
        else if (marker[0] === fence[0] && marker.length >= fence.length) fence = undefined;
        previous = "";
        continue;
      }
      if (fence) continue;
      const heading = /^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/.exec(line)?.[1];
      const title = heading ?? (/^\s{0,3}(?:=+|-+)\s*$/.test(line) && previous.trim() ? previous.trim() : undefined);
      if (title) return [{ page, title: title.replace(/[*_`]/g, "") }];
      previous = line;
    }
    return [{ page, title: page }];
  }).sort((a, b) => a.page.localeCompare(b.page));
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
    const text = m[2]!.replace(/[*_`]/g, "");
    const id = slugger.slug(text);
    const depth = m[1]!.length;
    if (depth === 2 || depth === 3) out.push({ depth, text, id });
  }
  return out;
}
