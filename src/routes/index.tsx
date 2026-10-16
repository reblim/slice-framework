import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_NAME, TAGLINE } from "@/config";
import { currentVersion } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Documentation` },
      { name: "description", content: TAGLINE },
      { property: "og:title", content: `${SITE_NAME} — Documentation` },
      { property: "og:description", content: TAGLINE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">{SITE_NAME}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{TAGLINE}</p>
      <Link
        to="/spec/$version"
        params={{ version: currentVersion.id }}
        className="mt-8 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Read the spec ({currentVersion.label})
      </Link>
    </main>
  );
}
