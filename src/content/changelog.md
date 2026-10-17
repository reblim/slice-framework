# Changelog

**Current version: [v0.3.2](/spec/0.3.2), the first public release of the alpha.** All versions are Milber Ferreira's, developed with OpenAI's and Anthropic's models.

## Versions

| Version | Status | Author | AI assistance | What it is |
| --- | --- | --- | --- | --- |
| [v0.3.2](/spec/0.3.2) | Current: public alpha | Milber | Copy and consistency review with Anthropic's models | Patch: public name, AI-first positioning, self-contained definitions, quick estimate |
| [v0.3.1](/spec/0.3.1) | Archived | Milber | Alpha review with OpenAI's models; Anthropic's models fact-checked it and redrafted | Patch: alpha status, SliceOps correction, exploratory thresholds |
| [v0.3](/spec/0.3) | Archived | Milber | External review with OpenAI's models; Anthropic's models fact-checked it and redrafted | Pilot-ready working specification |
| [v0.2](/spec/0.2) | Archived | Milber | Anthropic's models corroborated the research and redrafted | First research-backed revision |
| [v0.1](/spec/0.1) | Archived | Milber | OpenAI's models | Founding specification |

**Lineage:** initial research → v0.1 → research review (section 0 of v0.2) → v0.2 → external review and assessment → v0.3 → alpha readiness review, SliceOps verification and naming assessment → v0.3.1 → name decision and pre-release copy review → v0.3.2.

Newest first. Each entry lists what was added, changed, removed and fixed.

## v0.3.2 (Public Alpha) — 17 October 2026

Patch release: no rule changes. First version published in the public repository.

**Added**

- What AI changes, and what it doesn't: a worked authentication example (section 1.2).
- Quick estimate: a one-minute F1 estimate from the four parts of the forecast formula, with starting suggestions per risk tier (section 8.8, informative), and a quick-estimate view in the calculator.
- Definitions of the hierarchy, horizons, sizes, AI leverage and risk, previously only in v0.1 (sections 5.0 and 8.0).
- How to join the pilot, and a plain data-handling notice in the pilot protocol.

**Changed**

- The public name is SLICE Framework, SLICE for short; "working name" is removed everywhere (decision D30).
- The homepage, README and spec opening say directly that SLICE is for planning and estimating software when AI writes the code (D31).
- The workflow in section 10 is written out in text.
- The pilot size in section 14 now matches the pilot protocol: 5–10 teams.
- Version history moved out of the spec's opening and into this changelog.

**Fixed**

- Leftovers from the original drafting tool in the archived specs: an "@" before the author's name, references to tabs that don't exist on this site, and placeholders where diagrams were.

## v0.3.1 (Public Alpha) — 16 October 2026

Patch release: no rule changes.

**Added**

- Public-alpha status note and the alpha principle (section 14.3).
- A SliceOps comparison in the landscape (section 3).
- The public alpha kit: start-here page, Quick Start, templates and pilot protocol.

**Changed**

- Pilot thresholds labelled exploratory; F3 forecasting marked unavailable during the alpha.
- SLICE confirmed as a provisional working name; the public name is still to be decided.

**Fixed**

- v0.3 wrongly said SliceOps could not be found.

## v0.3 — 16 October 2026

**Added**

- A fixed vocabulary: generation speed, implementation effort, delivery lead time, verification effort, total delivery cost, cost of learning, value delivered, Accepted, Resolved.
- Proportionate Planning: Coordination Budget, Decision Gate, Learning Investment.
- Mode E, Experiment to decide, with a table matching each test to the uncertainty it can resolve.
- Item types Bet, Obligation and Improvement, with a guard on Improvement.
- Separate delivery (Ready → Accepted) and outcome (Proposed → Resolved) lifecycles.
- Three minimum records: Roadmap item, Slice card, Evidence record.
- A high-risk rule for solo founders; delivery-economics metrics; pilot hypothesis H6 on overhead.
- Faros Speed Trap, OpenSpec, Kiro and Evidence-Based Management in the evidence and landscape.

**Changed**

- Thesis: "Building is cheap" became "When implementation stops being the slowest step, delivery is limited by deciding and proving."
- C: Capacity-bound became Constraint-aware, with verification as the default constraint.
- Forecasting: sample minimums became floors; F3 needs back-tested calibration; small teams report P50 and P85 only; every range shows its sample count.
- Spec storage: repository-only became one authoritative, accessible, versioned source.
- Mandatory metrics: review wait became wait at the constraint; validated-outcome rate became outcome resolution.
- Kill criterion became decision criterion; the checkout example now uses count-based criteria.

**Removed**

- Decision Budget and Mode B (Build to decide).
- Removal rate as a metric.

**Fixed**

- Spec Kit had been described as feature-only; it now includes idea assessment.
- The 4% → 6% conversion example could not be detected at startup volumes.
- The independent-review rule was impossible for a solo founder.
- Delivery "done" had been tied to outcome review.

## v0.2 — 16 October 2026

**Added**

- Planning split into coordination, decision and proof.
- Decision Budget with Mode B (Build to decide) and a fifth stop-rule question.
- Bets with outcome hypothesis, kill criterion and review date.
- Specification as agent context, in three layers.
- Verification capacity as the WIP limit, with risk-tiered verification.
- Decision wait in the forecast formula; codebase type in reference classes; minimum evidence per F-level.
- Metrics: decision latency, idea-to-evidence time, review wait, unreviewed merges, validated-outcome rate, removal rate.
- Evidence base (DORA, METR, Faros, Stanford, Andrew Ng) and landscape (AI-DLC, BMAD, Spec Kit, Shape Up, Kanban, XB Software).
- Pilot hypotheses H1–H5 and a red team.

**Changed**

- C: Confidence-led became Capacity-bound.
- Core line became "Decide deliberately. Build small. Count only what is proven."
- Scope narrowed from "solo founder to enterprise" to teams of 1–25.
- Conformance rules grew from seven to ten.
- Planning Overhead Ratio replaced by coordination minutes and decision latency.

**Fixed**

- Normative voice; interface leftovers removed.
- Two corrections to the initial research: METR's 2026 update, and keeping the multiplier explorer out of the spec.

## v0.1 — 16 October 2026

- Founding specification, built on the initial research: SLICE Roadmapping and SLICE Forecasting; principles Strategic, Lightweight, Iterative, Confidence-led, Evidence-driven; the five-level hierarchy; Now/Next/Later; four item types; the Planning Budget with modes 0–3 and the stop-planning rule; XS–XL sizing, AI leverage, risk and F0–F3; Direction/Target/Commitment; seven conformance rules.
