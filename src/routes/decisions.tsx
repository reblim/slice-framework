import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, canonicalUrl } from "@/config";
import { DocPage } from "@/components/DocPage";

const url = canonicalUrl("/decisions");

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: `Decisions · ${SITE_NAME}` },
      { name: "description", content: `Recorded design decisions for ${SITE_NAME}.` },
      { property: "og:title", content: `Decisions · ${SITE_NAME}` },
      { property: "og:description", content: `Recorded design decisions for ${SITE_NAME}.` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: () => <DocPage path="decisions" />,
});
