/** Short sidebar labels. Page titles stay the full headings in the documents. */
export const SIDEBAR_LABELS = {
  specification: [
    { to: "spec" as const, label: "Specification" },
    { to: "calculator" as const, label: "Calculator" },
  ],
  alpha: [
    { page: "start-here", label: "Start here" },
    { page: "quick-start", label: "Quick Start" },
    { page: "templates", label: "Templates" },
    { page: "pilot-protocol", label: "Pilot protocol" },
  ],
  history: [
    { to: "changelog" as const, label: "Changelog" },
    { to: "decisions" as const, label: "Decisions" },
  ],
  researchIndex: "All research",
  research: [
    { page: "01-initial-research", label: "Initial research" },
    { page: "02-external-review-of-v0-2", label: "Review of v0.2" },
    { page: "03-assessment-of-external-review", label: "Assessment of the review" },
    { page: "04-alpha-readiness-review", label: "Alpha readiness review" },
    { page: "05-naming-research", label: "Naming research" },
    { page: "06-naming-and-versioning-assessment", label: "Naming assessment" },
  ],
};
