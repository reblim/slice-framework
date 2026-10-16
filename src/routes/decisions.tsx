import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME } from "@/config";
import { DocPage } from "@/components/DocPage";

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: `Decisions · ${SITE_NAME}` },
      { name: "description", content: `Recorded design decisions for ${SITE_NAME}.` },
      { property: "og:title", content: `Decisions · ${SITE_NAME}` },
      { property: "og:description", content: `Recorded design decisions for ${SITE_NAME}.` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DocPage path="decisions" />,
});
