# Start here

**SLICE is an open framework for planning, estimating and shipping software when AI writes the code.** It is built for teams of 1 to 25 and is in public alpha: open for testing and criticism, and not yet proven.

## What changed

For many features, AI tools now build in hours or days what used to take weeks. But the rest of the work did not speed up: reviewing the code, testing it, deciding what exactly to build, and waiting on people outside the team. Often it grew, because there is more code to check.

Take an authentication module, as an illustrative estimate rather than a measurement:

| | Before AI tools | With AI tools | What AI changes |
| --- | --- | --- | --- |
| Building | About 2 weeks | 1–2 days | AI writes most of the code |
| Review and security testing | 2–4 days | 2–4 days | AI pre-reviews, writes tests and scans for issues, but there is more code to check and a person still signs off |
| Open decisions | 1–3 days | 0.5–2 days | Quick AI prototypes make the options concrete sooner; people still decide |
| Waiting on others | 0–5 days | 0–5 days | AI can't make a vendor or a legal team answer faster |
| **Until it is live** | **About 3–4 weeks** | **About 1–3 weeks** | |

AI speeds up every part of the work, but by very different amounts: building drops by around 90%, review and decisions by a little, waiting not at all. So the slowest part moves from building to review and decisions. "Done in a day" is true for the code and wrong for the feature. SLICE plans and estimates all of it.

## What SLICE gives you

- **Planning in proportion to risk.** An obvious change gets a one-line note; anything touching money, logins or personal data gets a reviewed design. Five planning modes tell you which is which.
- **Honest estimates.** Build time with AI, plus review, decisions and waiting, labelled with how much evidence is behind them. Never "old estimate × AI factor".
- **A protected bottleneck.** Find where work waits longest, usually review, and stop starting new work while it is full.
- **Proof that it worked.** Uncertain work is a Bet with a criterion you can count, checked on a date you set in advance.

## Five principles

| Principle | In one line |
| --- | --- |
| Strategic | Every item traces to an outcome, an improvement or an obligation. |
| Lightweight | Cut coordination; keep the decisions and assurance that matter. |
| Iterative | Build, test, decide and adapt in small slices. |
| Constraint-aware | Find where work waits longest and limit work there. |
| Evidence-driven | Every forecast and claim says what evidence it rests on. |

## Use it

| If you want to | Go to |
| --- | --- |
| Try SLICE on real work in 20 minutes | [Quick Start](/alpha/quick-start) |
| Estimate one feature in a minute | [Calculator](/calculator) |
| Copy the three records SLICE uses | [Templates](/alpha/templates) |
| Read every rule | [Specification](/spec) |
| Join the eight-week pilot | [Pilot protocol](/alpha/pilot-protocol) |

## About

SLICE is open source: the specification is licensed under CC BY 4.0 and the website code under MIT. It is developed by Milber Ferreira, with research and drafting help from OpenAI's and Anthropic's models. Feedback and pilot reports go to [GitHub](https://github.com/reblim/slice-framework/issues).
