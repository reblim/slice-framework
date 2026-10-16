import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, TAGLINE } from "@/config";
import { Home } from "@/pages/Home";

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
  component: Home,
});

