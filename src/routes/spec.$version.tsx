import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE_NAME } from "@/config";
import { currentVersion, getDoc, getToc, getVersion, versions } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { PageError, PageNotFound } from "@/components/PageStatus";

export const Route = createFileRoute("/spec/$version")({
  loader: ({ params }) => {
    const v = getVersion(params.version);
    if (!v || getDoc(`spec/${v.id}`) === undefined) throw notFound();
    return { version: v };
  },
  head: ({ params }) => ({
    meta: [
      { title: `${SITE_NAME} spec v${params.version}` },
      { name: "description", content: `${SITE_NAME} specification, version ${params.version}.` },
      { property: "og:title", content: `${SITE_NAME} spec v${params.version}` },
      { property: "og:description", content: `${SITE_NAME} specification, version ${params.version}.` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SpecPage,
  errorComponent: PageError,
  notFoundComponent: PageNotFound,
});

function SpecPage() {
  const { version } = Route.useLoaderData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const md = getDoc(`spec/${version.id}`);
  if (md === undefined) return <PageNotFound />;
  const toc = getToc(md);

  const tocList = (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-medium text-foreground">On this page</p>
      {toc.length === 0 && <p className="text-muted-foreground">No sections.</p>}
      <ul className="space-y-1">
        {toc.map((t) => (
          <li key={t.id} className={t.depth === 3 ? "pl-3" : ""}>
            <a href={`#${t.id}`} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4">
          <button type="button" className="icon-btn md:hidden" aria-label="Open contents" onClick={() => setOpen(true)}>
            <Menu size={16} />
          </button>
          <label htmlFor="version" className="text-sm text-muted-foreground">Version</label>
          <select
            id="version"
            value={version.id}
            onChange={(e) => navigate({ to: "/spec/$version", params: { version: e.target.value } })}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-background p-4">
            <button type="button" className="icon-btn mb-4" aria-label="Close contents" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
            {tocList}
          </aside>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl gap-10 px-4 py-8">
        <aside className="sticky top-20 hidden h-fit w-56 shrink-0 md:block">{tocList}</aside>
        <main className="min-w-0 max-w-[72ch] flex-1">
          {version.status === "archived" && (
            <div role="note" className="mb-6 rounded-md border border-border bg-muted px-4 py-3 text-sm">
              <strong>Archived version.</strong>{" "}
              <Link to="/spec/$version" params={{ version: currentVersion.id }} className="underline">
                Go to the current version ({currentVersion.label})
              </Link>
            </div>
          )}
          <Markdown source={md} />
        </main>
      </div>
    </div>
  );
}
