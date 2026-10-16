import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME } from "@/config";
import { DocPage } from "@/components/DocPage";

export const Route = createFileRoute("/alpha/$page")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.page} · Alpha · ${SITE_NAME}` },
      { name: "description", content: `${SITE_NAME} alpha notes: ${params.page}.` },
      { property: "og:title", content: `${params.page} · Alpha · ${SITE_NAME}` },
      { property: "og:description", content: `${SITE_NAME} alpha notes: ${params.page}.` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DocPage path={`alpha/${Route.useParams().page}`} />,
});
