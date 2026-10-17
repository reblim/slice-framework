import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calculator/Calculator";
import { SITE_NAME, canonicalUrl } from "@/config";

const title = `Calculator · ${SITE_NAME}`;
const description = "Estimate a feature in one minute: AI build time plus review, decisions and waiting. Or forecast from your team's own history.";
const url = canonicalUrl("/calculator");

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: Calculator,
});