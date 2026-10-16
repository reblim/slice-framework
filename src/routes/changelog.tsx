import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME } from "@/config";
import { DocPage } from "@/components/DocPage";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: `Changelog · ${SITE_NAME}` },
      { name: "description", content: `Changes across ${SITE_NAME} versions.` },
      { property: "og:title", content: `Changelog · ${SITE_NAME}` },
      { property: "og:description", content: `Changes across ${SITE_NAME} versions.` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DocPage path="changelog" />,
});
