import { createFileRoute, redirect } from "@tanstack/react-router";
import { currentVersion } from "@/lib/content";

export const Route = createFileRoute("/spec/")({
  beforeLoad: () => {
    throw redirect({ to: "/spec/$version", params: { version: currentVersion.id } });
  },
});
