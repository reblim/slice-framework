import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SITE_NAME } from "@/config";
import { currentVersion, getDoc, getVersion } from "@/lib/content";
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
  const md = getDoc(`spec/${version.id}`);
  if (md === undefined) return <PageNotFound />;

  return (
    <main className="spec-article">
      {version.status === "archived" && (
        <div role="note" className="archive-callout">
          <strong>Archived version.</strong>
          <Link to="/spec/$version" params={{ version: currentVersion.id }}>Go to the current version ({currentVersion.label})</Link>
        </div>
      )}
      <Markdown source={md} />
    </main>
  );
}
