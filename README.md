# SLICE Framework

**Plan and estimate software when AI writes the code.**

AI made building fast. Reviewing, testing and deciding didn't keep up. SLICE is an open framework for planning, estimating and shipping software with AI, for teams of 1 to 25. It helps a team decide what deserves building, how much planning each piece deserves, when it will really be live, and whether it worked.

> **Status: public alpha (v0.3.2).** Open for testing, criticism and refinement. SLICE is not a proven framework, an industry standard or a successor to Scrum. It is not affiliated with SliceOps.

**Website:** https://sliceframework.org

## Why SLICE exists

For many tasks, AI tools now build in days what used to take weeks. The rest of the work did not speed up: reviewing and testing the code, deciding what exactly to build, and waiting on people outside the team. In an illustrative estimate, an authentication module that once took 3–4 weeks takes 1–3 weeks with AI tools, not one day.

When implementation stops being the slowest step, delivery is limited by deciding and proving. SLICE estimates all of it, finds where work waits longest, and manages work to that limit. It never multiplies an old estimate by an "AI factor".

## The five principles

| Principle | In one line |
| --- | --- |
| Strategic | Every item traces to an outcome, an improvement or an obligation. |
| Lightweight | Cut coordination; keep the decisions and assurance that matter. |
| Iterative | Deliver, verify and learn in small slices. |
| Constraint-aware | Manage work to the team's real bottleneck, presumed to be verification until measured. |
| Evidence-driven | Every forecast shows its sample, its assumptions and its track record. |

## What is in the framework

- **Roadmapping:** Outcome → Initiative → Feature → Slice, with Now / Next / Later horizons and three item types: Bet, Obligation and Improvement.
- **Proportionate Planning:** five planning modes (0, 1, E, 2, 3), each with its own coordination time box, so planning effort matches risk.
- **Forecasting:** a one-minute quick estimate (AI build time plus review, decisions and waiting), relative sizes (XS–XL) with no hour equivalents, reference classes, and evidence levels F0–F3. Ranges always carry their sample count, and AI leverage is never used as a multiplier.
- **Flow:** work-in-progress limits at the constraint, and verification tiers set by risk.
- **Three records:** Roadmap item, Slice card and Evidence record.

## Start here

| If you want to | Read |
| --- | --- |
| Understand SLICE in five minutes | [Start here](https://sliceframework.org/alpha/start-here) |
| Estimate one feature in a minute | [Quick estimate, specification section 8.8](https://sliceframework.org/spec/0.3.2#88-quick-estimate-informative) |
| Try it on real work in 20 minutes | [Quick Start](https://sliceframework.org/alpha/quick-start) |
| Copy the three records | [Templates](https://sliceframework.org/alpha/templates) |
| Read the full specification | [Specification v0.3.2](https://sliceframework.org/spec/0.3.2) |
| Join or run a pilot | [Pilot protocol](https://sliceframework.org/alpha/pilot-protocol) |
| See how SLICE evolved | [Changelog](https://sliceframework.org/changelog) · [Decisions](https://sliceframework.org/decisions) · [Research](https://sliceframework.org/research) |

Earlier versions of the specification ([v0.3.1](src/content/spec/0.3.1.md), [v0.3](src/content/spec/0.3.md), [v0.2](src/content/spec/0.2.md), [v0.1](src/content/spec/0.1.md)) are kept unchanged so the evolution stays visible.

## Repository layout

| Path | Contents |
| --- | --- |
| `src/content/` | The framework itself: specification, alpha kit, changelog, decisions and research, in Markdown |
| `src/` (everything else) | The documentation website |
| `.github/` | Issue and pull request templates, code owners, dependency updates |

## Run the website locally

Requires Node.js 20.19 or later.

```bash
git clone https://github.com/reblim/slice-framework.git
cd slice-framework
npm install
npm run dev
```

## Contributing

Pilot reports, criticism, research and pull requests are welcome.

- **Feedback on the method:** open a [specification feedback](https://github.com/reblim/slice-framework/issues/new?template=spec-feedback.yml) issue. Please discuss a methodology change in an issue before opening a pull request.
- **Pilot results:** use the [pilot report](https://github.com/reblim/slice-framework/issues/new?template=pilot-report.yml) form.
- **Website problems:** use the [website issue](https://github.com/reblim/slice-framework/issues/new?template=website-issue.yml) form.

Every commit needs a DCO sign-off (`git commit -s`). See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). To report a security problem, see [SECURITY.md](SECURITY.md).

## Licence

- **Specification and documentation** (everything in `src/content/`): [Creative Commons Attribution 4.0 International (CC BY 4.0)](src/content/LICENSE). You may share and adapt them, including commercially, as long as you give attribution.
- **Website code**: [MIT](LICENSE).

Suggested attribution:

> Based on the SLICE Framework by Milber Ferreira (https://github.com/reblim/slice-framework), licensed under CC BY 4.0.

If you change the framework, say so, and don't present your version as an official SLICE release.

## Citing SLICE

GitHub shows a "Cite this repository" button based on [CITATION.cff](CITATION.cff).

## Authorship

SLICE was conceived and is developed by Milber Ferreira. See [AUTHORS.md](AUTHORS.md).

Copyright © 2026 Milber Ferreira.
