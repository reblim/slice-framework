# SLICE (working name)

**Decide deliberately. Build small. Count only what is proven.**

SLICE is an experimental product roadmapping, forecasting and delivery framework for small, AI-assisted teams of 1–25 people. It helps a team decide what deserves building, how much planning each piece of work deserves, when it is likely to land, and whether it worked.

> **Status: public alpha (v0.3.1).** Open for testing, criticism and refinement. SLICE is not a proven framework, an industry standard or a successor to Scrum. "SLICE" is a working name, and the project is unrelated to SliceOps.

## Why SLICE exists

When implementation stops being the slowest step, delivery is limited by deciding and proving. Most teams still spend their planning effort on coordination, and too little on decisions and verification. SLICE finds the team's current limit and manages work to it.

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
- **Forecasting:** relative sizes (XS–XL) with no hour equivalents, reference classes, and evidence levels F0–F3. Ranges always carry their sample count, and AI leverage is never used as a multiplier.
- **Flow:** work-in-progress limits at the constraint, and verification tiers set by risk.
- **Three records:** Roadmap item, Slice card and Evidence record.

## Start here

| If you want to | Read |
| --- | --- |
| Understand SLICE in five minutes | [Start here](src/content/alpha/start-here.md) |
| Try it on real work in 20 minutes | [Quick Start](src/content/alpha/quick-start.md) |
| Copy the three records | [Templates](src/content/alpha/templates.md) |
| Read the full specification | [Specification v0.3.1](src/content/spec/0.3.1.md) |
| Join or run a pilot | [Pilot protocol](src/content/alpha/pilot-protocol.md) |
| See how SLICE evolved | [Changelog](src/content/changelog.md) · [Decisions](src/content/decisions.md) · [Research](src/content/research/) |

Earlier versions of the specification ([v0.3](src/content/spec/0.3.md), [v0.2](src/content/spec/0.2.md), [v0.1](src/content/spec/0.1.md)) are kept unchanged so the evolution stays visible.

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
