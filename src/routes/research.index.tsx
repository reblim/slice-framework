import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_NAME, canonicalUrl } from "@/config";
import { getDoc, researchCard } from "@/lib/content";
import { SIDEBAR_LABELS } from "@/lib/nav";

const url = canonicalUrl("/research");

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: `Research · ${SITE_NAME}` },
      { name: "description", content: `Research documents for ${SITE_NAME}.` },
      { property: "og:title", content: `Research · ${SITE_NAME}` },
      { property: "og:description", content: `Research documents for ${SITE_NAME}.` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: ResearchIndex,
});

function ResearchIndex() {
  const documents = SIDEBAR_LABELS.research.flatMap((item) => {
    const source = getDoc(`research/${item.page}`);
    return source ? [{ page: item.page, ...researchCard(source) }] : [];
  });
  return (
    <main className="research-index">
      <p className="article-eyebrow">Research</p>
      <h1>Research</h1>
      {documents.length === 0 ? (
        <p className="text-muted-foreground">Research documents coming soon.</p>
      ) : (
        <ul className="research-list">
          {documents.map(({ page, title, description, date, author }) => (
            <li key={page}>
              <Link to="/research/$page" params={{ page }} className="research-title">
                {title}
              </Link>
              {description ? <p className="research-desc">{description}</p> : null}
              <p className="research-meta">{[date, author].filter(Boolean).join(" · ")}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
