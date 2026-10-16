import { Link } from "@tanstack/react-router";
import { SITE_NAME, TAGLINE } from "@/config";
import { getDoc } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export function Home() {
  const md = getDoc("alpha/start-here");
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">{SITE_NAME}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{TAGLINE}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/spec"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Read the spec
        </Link>
        <Link
          to="/alpha/$page"
          params={{ page: "quick-start" }}
          className="inline-block rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Quick Start
        </Link>
      </div>
      {md ? (
        <div className="mt-14">
          <Markdown source={md} />
        </div>
      ) : (
        <p className="mt-14 text-sm text-muted-foreground">
          The start-here guide isn&rsquo;t published yet. Read the spec in the meantime.
        </p>
      )}
    </main>
  );
}
