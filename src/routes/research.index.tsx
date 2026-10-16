import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_NAME } from "@/config";
import { listDocs } from "@/lib/content";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: `Research · ${SITE_NAME}` },
      { name: "description", content: `Research documents for ${SITE_NAME}.` },
      { property: "og:title", content: `Research · ${SITE_NAME}` },
      { property: "og:description", content: `Research documents for ${SITE_NAME}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearchIndex,
});

function ResearchIndex() {
  const documents = listDocs("research");
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10">
      <h1 className="text-3xl font-semibold">Research</h1>
      {documents.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Research documents coming soon.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {documents.map(({ page, title }) => (
            <li key={page} className="py-3">
              <Link to="/research/$page" params={{ page }} className="underline underline-offset-4">{title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}