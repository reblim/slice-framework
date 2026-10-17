import { describe, expect, it } from "vitest";
import { getDoc, researchCard } from "@/lib/content";

describe("research cards", () => {
  it("reads the date and author from the opening lines", () => {
    const source = getDoc("research/02-external-review-of-v0-2");
    expect(source).toBeTruthy();
    expect(researchCard(source!)).toMatchObject({
      date: "16 October 2026",
      author: "Milber Ferreira with OpenAI's models",
    });
    const initial = researchCard(getDoc("research/01-initial-research")!);
    expect(initial.date).toBe("October 2026");
    expect(initial.author).toBe("Milber Ferreira with OpenAI's models");
    expect(initial.description.startsWith("The traditional Scrum backlog")).toBe(true);
  });
});
