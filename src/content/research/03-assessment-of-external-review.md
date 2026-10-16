# Assessment of the external review of v0.2

16 October 2026

> **By Claude, as input to Milber Ferreira.** A fact-check of and response to the [external review of v0.2](/research/02-external-review-of-v0-2), given before v0.3 was drafted. Reproduced unchanged apart from formatting. One finding here was later shown to be wrong: SliceOps does exist, at sliceops.org (corrected in v0.3.1).

Mostly yes. The review catches real mistakes in v0.2, and I'd accept most of its changes. I'd push back on its thesis wording, the forecasting remedy, and one metric, and I couldn't verify one of its competitors.

## Where it's right and v0.2 was wrong

- v0.2 called Spec Kit a tool for building one feature. That's out of date: deciding whether an idea deserves investment is now one of its three processes, ending in an evidence-backed go, clarify or stop decision. So the claim that nobody else handles product decisions has to go.
- The checkout bet example couldn't work. Detecting a move from 4% to 6% conversion needs about 1,860 trials per group (80% power, 5% significance). An early startup can't get that in 8 weeks, so small-sample bets need qualitative decision criteria.
- Requiring independent human review for high-risk work is impossible for a solo founder.
- "Done only after outcome review" mixed two lifecycles. Separate delivery and outcome states are cleaner.

| Proposed change | Verdict |
| --- | --- |
| Proportionate Planning replaces Decision Budget | Agree. The old name implied capping decisions, the opposite of the thesis. |
| Experiment to decide (Mode E) | Agree. A prototype can't test willingness to pay. |
| Forecast statistics | Partly. The diagnosis is right, the fix too vague. |
| Constraint-aware replaces Capacity-bound | Agree, with a default. |
| Separate delivery and outcome states | Agree |
| Bet, Obligation, Improvement | Agree, with a guard. |
| Looser spec-storage rules | Agree |
| Solo-founder verification | Agree, and extend it. |
| Vocabulary and the three-record minimum | Agree. The three records are the best idea in the review. |
| New thesis wording | Disagree |
| Cost per validated outcome | Disagree |

## Where I'd push back

1. **Thesis.** "AI accelerates implementation" is itself the contested claim, and the new wording no longer says anything testable. Proposed instead: "When implementation stops being the slowest step, delivery is limited by deciding and proving. SLICE finds the current limit and manages work to it."
2. **Forecasting.** If you remove all sample minimums, "adequate observations" becomes something anyone can claim. Keep minimums as necessary but not sufficient, and print the sample count beside every range. A forecast should earn F3 only through back-tested hit rates. Drop P95 for small teams: 20 data points can't support a 1-in-20 tail.
3. **Cost per validated outcome.** A small team resolves a handful of very different bets per quarter, so this ratio will be noise. Track learning spend per bet instead, and cost per accepted slice within a reference class.
4. **Constraint-aware needs a default.** The latest Faros data points downstream again: PRs merged without review are up 76%, time in QA has risen threefold, and restarts are up 67%. Assume verification is the constraint until your data shows otherwise. Keep the risk-based verification minimum whatever the constraint turns out to be.
5. **"Improvement" can become an escape from hypotheses.** Add a guard: customer-facing work with uncertain value, or work above a set appetite, must be a Bet.
6. **Solo verification.** First reduce what can go wrong by design: hosted checkout, managed auth, test mode, staged rollout. Then pay for a specialist review of what remains.

## Fact check

- **OpenSpec:** confirmed. A lightweight specification workflow where proposals are drafted and reviewed with the AI before implementation.
- **Evidence-Based Management:** confirmed. It proposes four key value areas: Current Value, Unrealized Value, Time to Market and Ability to Innovate.
- **Faros Speed Trap:** confirmed for the three figures above. The +14.5% incidents figure could not be confirmed.
- **SliceOps:** not found at the time as an AI development framework; the only match was an academic proposal for managing machine-learning models inside 6G network slices. *Later correction: SliceOps does exist, at sliceops.org, as a small, little-known open framework. See v0.3.1.*

## Sources

- [Spec Kit on PyPI](https://pypi.org/project/specify-cli/1.0.8/)
- [OpenSpec project summary](https://www.sourcepulse.org/projects/15737171)
- [Faros AI, The Speed Trap](https://www.faros.ai/events/your-ai-bottleneck)
- [Scrum.org: Evidence-Based Management](https://www.scrum.org/node/29128)
- [SliceOps](https://sliceops.org)
