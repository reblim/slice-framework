import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, canonicalUrl } from "@/config";
import { DocPage } from "@/components/DocPage";

const url = canonicalUrl("/changelog");

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: `Changelog · ${SITE_NAME}` },
      { name: "description", content: `Changes across ${SITE_NAME} versions.` },
      { property: "og:title", content: `Changelog · ${SITE_NAME}` },
      { property: "og:description", content: `Changes across ${SITE_NAME} versions.` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: () => <DocPage path="changelog" />,
});
