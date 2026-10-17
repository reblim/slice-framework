# Naming the framework: research

16 October 2026

> **By Milber Ferreira, with OpenAI's models.** Naming research reproduced as written; formatting converted to Markdown and the interactive selection buttons omitted. A follow-up assessment is in [Naming and versioning assessment](/research/06-naming-and-versioning-assessment). **Outcome:** SLICE is the public name (decision D30, 17 October 2026).

SLICE is a strong name, but it is not the only good name—and I would not commit to it yet.

For an open-source methodology aspiring to become as recognisable as Scrum, Kanban or Shape Up, the name needs to pass five tests: it must be easy to say, accurately represent the methodology, have a natural acronym, work internationally and be reasonably distinguishable from existing projects.

There is a significant issue with SLICE: SliceOps already operates in AI-first software engineering, uses slices as its central unit of work and publishes an open framework with related concepts. It is not identical to ours, but the overlap is real.

A second finding is that the obvious alternatives are crowded too. SPARC, TRACE, CLEAR, CRAFT, SCALE and ORBIT all have established framework uses, several directly related to AI.

So rather than simply generating another acronym, I would shortlist names that are meaningful before someone learns what the letters stand for.

## 1. Strongest candidates

These are newly proposed expansions of the methodology, not names cleared for publication.

| Name | Expansion | Strength | Weakness |
| --- | --- | --- | --- |
| SLICE (current benchmark) | Strategic · Lightweight · Iterative · Constraint-aware · Evidence-driven | Excellent metaphor for small, verifiable increments. Its five principles already match v0.3 without rewriting the framework. | Proximity to SliceOps and widespread vertical-slice terminology. |
| SCOPE | Strategic · Constraint-aware · Outcome-led · Proportionate · Evidence-driven | Perhaps the strongest alternative in terms of actual product management. Every word maps directly to a core v0.3 practice. | An existing SCOPE Framework is used for complex-systems measurement, and the name is inherently common. |
| BRIEF | Bet-led · Risk-aware · Iterative · Evidence-driven · Forecastable | Well aligned with the principle that specification should be proportionate. Easy to remember and communicate. | Emphasises bets over obligations, and Forecastable describes an aspiration rather than a universal property of work. |
| SPARK | Strategic · Proportionate · Adaptive · Risk-aware · Knowledge-led | Memorable, positive and accessible to founders. | Knowledge-led is less precise than evidence-driven; existing technology uses of Spark create discoverability problems. |
| PULSE | Purpose-led · Uncertainty-aware · Lightweight · Slice-based · Evidence-driven | Captures continuous learning, small increments and rapid feedback. | Does not name constraints or forecasting, and Pulse is heavily used in software products. |

## 2. Comparative assessment

A qualitative naming assessment, not a legal availability score.

| Name | Acronym fit | Memorability | Distinctiveness outlook | Verdict |
| --- | --- | --- | --- | --- |
| SLICE | Excellent | Excellent | Challenging | Strongest overall |
| SCOPE | Excellent | Very good | Challenging | Best alternative |
| BRIEF | Good | Excellent | Uncertain | Interesting |
| PULSE | Good | Excellent | Challenging | Too generic |
| SPARK | Moderate | Excellent | Challenging | More brand than method |

Excluded from the final shortlist: TRACE because of existing AI-specific frameworks, CRAFT because of directly related AI frameworks, and SPARC because it already names an agentic development methodology.

## 3. Do the acronyms actually match?

This is where SLICE wins.

| Letter | Principle | Meaning |
| --- | --- | --- |
| S | Strategic | Choose the right problems and investments. |
| L | Lightweight | Minimise unnecessary coordination and specification. |
| I | Iterative | Deliver, test and learn in small increments. |
| C | Constraint-aware | Control work according to real capacity and risk. |
| E | Evidence-driven | Ground estimates, forecasts and outcomes in evidence. |

There is no need to introduce awkward invented terms to make the letters fit.

Each principle is supported by the v0.3 specification: the roadmapping hierarchy and bets are strategic; Proportionate Planning is lightweight; experiments and delivery are iterative; work-in-progress policy is constraint-aware; and forecasting and outcome reviews are evidence-driven.

SCOPE also maps well, but replacing Iterative with Outcome-led and Lightweight with Proportionate would require rebalancing the principles.

I would not rewrite a coherent methodology merely to obtain a marginally different acronym.

## 4. Recommendation for the open-source project

> **Preferred identity: SLICE** — the AI-native product delivery framework. Strategic · Lightweight · Iterative · Constraint-aware · Evidence-driven. Public tagline: "Decide deliberately. Build small. Learn from evidence."

Open-source project structure:

- SLICE Framework — methodology and principles
- SLICE Roadmapping — strategy and prioritisation
- SLICE Forecasting — estimation and timelines
- SLICE Guide — community specification

For open-source adoption, prioritise clarity, portability and community governance over inventing a highly distinctive commercial-sounding brand.

A common English word is not automatically unsuitable for an open-source method. But open-source licensing does not eliminate trademark or naming-confusion risks.

If SLICE is retained, publish it under a more descriptive project identity, such as SLICE Product Framework, subject to clearance, rather than presenting SLICE as an uncontested standalone name.

One further recommendation: don't force AI into the acronym. The framework should work for human-led, AI-assisted and increasingly agent-driven teams. The name can remain durable even as those tools evolve.

## 5. Naming decision

My vote remains SLICE. Not because it's the only possible name, but because it is the most conceptually coherent of the candidates. Its existing industry overlap is the strongest reason to reconsider it—not the acronym.

Keep it as the working name while completing a dedicated naming clearance, rather than delaying the alpha or weakening the methodology to fit a new word.
