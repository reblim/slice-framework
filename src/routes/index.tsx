import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, DESCRIPTION } from "@/config";
import { Home } from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME}: plan and estimate software when AI writes the code` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: `${SITE_NAME}: plan and estimate software when AI writes the code` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

