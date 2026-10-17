import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Markdown } from "@/components/Markdown";

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/spec/0.3.2" }),
}));

describe("external links", () => {
  it("opens off-site links in a new window and keeps site links in this one", () => {
    render(
      <Markdown
        source={
          "[GitHub](https://github.com/reblim/slice-framework)\n[Spec](/spec/0.3.2)\n[Site](https://sliceframework.org/changelog)\n[Section](#status)"
        }
      />,
    );

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Spec" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Site" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Section" })).not.toHaveAttribute("target");
  });
});
