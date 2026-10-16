import { getDoc } from "@/lib/content";
import { Markdown } from "./Markdown";

export function DocPage({ path }: { path: string }) {
  const md = getDoc(path);
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10">
      {md ? <Markdown source={md} /> : <p className="text-muted-foreground">No content yet.</p>}
    </main>
  );
}
