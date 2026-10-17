import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calculator/Calculator";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/calculator")({
  head: () => ({ meta: [
    { title: `Forecast calculator · ${SITE_NAME}` },
    { name: "description", content: `Forecast delivery from comparable slice history and judgment scenarios, and check commitments, verification and flow with ${SITE_NAME}.` },
    { property: "og:title", content: `Forecast calculator · ${SITE_NAME}` },
    { property: "og:description", content: `Evidence-led slice forecasts, commitment labels, verification and flow checks for the ${SITE_NAME} public alpha.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Calculator,
});