import { createFileRoute, notFound } from "@tanstack/react-router";
import { SITE_NAME, canonicalUrl } from "@/config";
import { DocPage } from "@/components/DocPage";
import { documentHeading, firstBoldSentence, getDoc } from "@/lib/content";
import { PageNotFound } from "@/components/PageStatus";

export const Route = createFileRoute("/research/$page")({
  beforeLoad: ({ params }) => {
    if (getDoc(`research/${params.page}`) === undefined) throw notFound();
  },
  notFoundComponent: PageNotFound,
  head: ({ params }) => {
    const source = getDoc(`research/${params.page}`) ?? "";
    const title = `${documentHeading(source)} · ${SITE_NAME}`;
    const description = firstBoldSentence(source);
    const url = canonicalUrl(`/research/${params.page}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: () => <DocPage path={`research/${Route.useParams().page}`} />,
});
