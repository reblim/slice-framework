import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { documentsInFolder, listDocs } from "@/lib/content";

// Match navigation destinations directly and run static document guards without rendering.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    ["/spec/0.3.1", "/spec/$version"],
    ["/alpha/start-here", "/alpha/$page"],
    ["/changelog", "/changelog"],
    ["/decisions", "/decisions"],
    ["/research", "/research/"],
    ["/research/example", "/research/$page"],
  ])("matches %s to its document route", (path, routeId) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(routeId);
  });

  it.each(["/alpha/does-not-exist", "/research/does-not-exist", "/spec/does-not-exist", "/nope"])("marks %s as not found", async (path) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
      history: createMemoryHistory({ initialEntries: [path] }),
      isServer: true,
    });
    await router.load();
    expect(router.state.statusCode).toBe(404);
  });
});

describe("Research discovery", () => {
  it("has no documents while the research folder is empty", () => {
    expect(listDocs("research")).toEqual([]);
  });

  it("lists every research markdown document using its first heading", () => {
    expect(documentsInFolder({
      "/src/content/research/beta.md": "```md\n# Not a title\n```\n## First heading\n# Later heading",
      "/src/content/research/alpha.md": "Intro\n\nResearch findings\n===\n",
      "/src/content/alpha/other.md": "# Other kit",
      "/src/content/research/ignored.txt": "# Not markdown",
    }, "research")).toEqual([
      { page: "alpha", title: "Research findings" },
      { page: "beta", title: "First heading" },
    ]);
  });
});
