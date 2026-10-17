import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, DESCRIPTION, canonicalUrl } from "@/config";
import { Home } from "@/pages/Home";

const title = `${SITE_NAME}: plan and estimate software when AI writes the code`;
const url = canonicalUrl("/");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: title },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: Home,
});
