import { getDoc } from "@/lib/content";
import { Markdown } from "./Markdown";
import { PageNotFound } from "./PageStatus";

export function DocPage({ path }: { path: string }) {
  const md = getDoc(path);
  if (md === undefined) return <PageNotFound />;
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10">
      <Markdown source={md} />
    </main>
  );
}
