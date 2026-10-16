# External review of v0.2: critical review and final recommendations

Research review · 16 October 2026

> **By Milber Ferreira, with ChatGPT.** A critical review of v0.2 that fed into v0.3, reproduced as written; formatting converted to Markdown. One claim was later checked: SliceOps was first thought not to exist, then found at sliceops.org (see the [assessment](/research/03-assessment-of-external-review) and v0.3.1).

I agree with the direction of v0.2, but I would not publish it unchanged. It is substantially stronger than v0.1, particularly in separating product decisions, engineering coordination and verification. However, the research reveals some important overlap with existing frameworks, several forecasting assumptions that need correction, and a major opportunity to sharpen the economic thesis.

My recommendation is to retain the SLICE concept provisionally, incorporate the strongest v0.2 improvements, and make a targeted set of changes for v0.3.

## 1. First, stop saying "building is cheap"

Your objection is justified. Cheap is imprecise because it could refer to speed, human effort, cash expenditure or overall economic cost. These are not interchangeable.

AI tools can reduce implementation time while increasing spending on models, infrastructure, review, rework or subsequent maintenance.

The evidence confirms this is not merely a theoretical distinction.

- Google's DORA research finds that AI can accelerate initial code generation, but some of that time saving is reallocated to auditing and verification.
- METR's February 2026 follow-up could not establish a reliable general productivity effect from newer coding agents because of substantial experimental biases.
- Faros AI's 2026 report found increased engineering throughput alongside substantially greater review delays and production-quality problems. These are observational associations, not proof that AI caused every increase.
- The existence of usage-based AI tooling and token billing makes cash cost a real consideration even when implementation is fast.

### The vocabulary I would standardise

| Term | Exact meaning | Use |
| --- | --- | --- |
| Generation speed | How quickly an agent produces an initial implementation | Internal tooling analysis |
| Implementation effort | Human attention and work required to construct or modify the solution | Estimation |
| Delivery lead time | Elapsed time from delivery request to accepted production release | Forecasting |
| Verification effort | Work required to establish that implementation satisfies its requirements | Capacity planning |
| Engineering cost | Human labour and tooling expenditure attributable to development | Economics |
| Total delivery cost | Engineering, AI usage, testing, infrastructure, rework and release costs | Cost comparison |
| Cost of learning | Resources spent obtaining evidence that informs a product decision | Discovery |
| Value delivered | Measurable customer, business or operational benefit | Product outcomes |

The two most important economic measures should be:

```latex
\text{Cost per accepted slice} = \frac{\text{Total delivery expenditure}}{\text{Accepted slices}}
```

and

```latex
\text{Cost per validated outcome} = \frac{\text{Total relevant investment}}{\text{Validated outcomes}}
```

These are portfolio-level diagnostic measures. They should not be used to compare teams delivering fundamentally different sizes, risks or types of work.

A better founding statement is:

> **Proposed SLICE thesis:** AI accelerates implementation, but valuable delivery still depends on decisions, verification and learning. SLICE aligns product decisions, engineering capacity and delivery evidence so teams can build the right things with less unnecessary coordination and more reliable expectations.

This statement is defensible without claiming that development is universally faster, cheaper or more productive.

## 2. The competitive research changes the positioning

There is a particularly important discovery: some competing tools have already expanded beyond mere software execution into product decisions and evidence.

We should therefore remove the assertion in v0.2 that other AI-native methodologies only answer how agents should build software.

### Closest existing approaches

| Method | What it already does | Implication for SLICE |
| --- | --- | --- |
| GitHub Spec Kit | Specifications, implementation workflows, and now an idea-assessment process with research and go/clarify/kill decisions | Direct overlap with decision gates |
| BMAD Method | Scales planning to complexity, supports idea exploration, research and execution | Direct overlap with progressive planning |
| OpenSpec | Lightweight, iterative specification and change management | Overlap with living agent context |
| Kiro | Requirements, architecture, tasks, agent execution and dependency-aware parallelism | Overlap with specification and delivery decomposition |
| AWS AI-DLC | Human-directed decisions, AI-generated plans, short execution cycles and persistent context | Overlap with the operating model |
| SliceOps | Decision records, atomic slices, verification evidence and agent governance | Very close conceptual and naming overlap |
| Shape Up | Time appetites, shaping and bets | Source for investment appetite |
| Evidence-Based Management | Outcome evidence, experimentation, time to market and organisational effectiveness | Overlap with the outcome and learning model |

These descriptions are drawn from the projects' own documentation.

Two findings deserve particular attention.

**GitHub Spec Kit already has idea assessment.** Its current documentation includes a standalone workflow that researches an idea, evaluates its evidence, examines alternatives and records a go, needs-clarification or kill decision. That directly contradicts v0.2's claim that Spec Kit is only a feature-building tool.

**SliceOps is a real naming and positioning concern.** It describes itself as a decision-first framework above AI coding tools, with atomic slices, auditable decision records and verification gates. Although its emphasis is more on engineering governance than on product strategy and probabilistic roadmap forecasting, the proximity is significant.

The credible opportunity for SLICE is narrower and more precise:

> An integrated, tool-independent method connecting product investment decisions, lightweight execution, empirical delivery forecasting and post-release outcome assessment—designed first for small AI-assisted teams.

That is a worthwhile positioning hypothesis. It is not yet proof of a unique methodology.

## 3. Eight changes I would make before accepting v0.3

### 1. Replace "Decision Budget" with "Proportionate Planning"

The v0.2 distinction between coordination, decisions and proof is correct. But Decision Budget is not quite the right name.

We should minimise unnecessary coordination, not necessarily constrain the time spent making valuable decisions.

I would define:

- **Coordination Budget:** limit administrative effort, documentation and status overhead.
- **Decision Gate:** establish what must be known or decided before progressing.
- **Learning Investment:** allocate resources to resolving uncertainty through research, experiments or prototypes.

These three concepts sit under Proportionate Planning.

This also prevents teams from treating short decision-making time as a virtue when a difficult decision merits careful investigation.

### 2. Rename "Build to decide" to "Test to decide"

Building a prototype is one form of discovery, but often not the best one.

Consider a subscription product whose central uncertainty is whether customers will pay €100 per month. Creating three different checkout interfaces does not necessarily answer that question. Customer commitments, pricing interviews or a genuine purchase experiment might provide better evidence.

The formal mode should therefore be:

> **Mode E — Experiment to decide.**

The team chooses the least costly credible test of the relevant uncertainty. That could be a customer interview, paper prototype, Lovable prototype, simulated workflow, fake-door experiment or small real implementation.

This is consistent with Lean UX and Teresa Torres's Continuous Discovery approach, both of which predate the current generation of AI coding tools.

The important rule is to distinguish evidence of usability, desirability, willingness to pay and technical feasibility. A prototype demonstrating one does not automatically establish the others.

### 3. Correct the forecasting statistics

This is the most significant technical problem in v0.2.

The claim that seven accepted slices establish a 75%-reliable forecasting range comes from an order-statistics result:

```latex
P(\min(X_1,\ldots,X_n)\leq X_{n+1}\leq\max(X_1,\ldots,X_n)) = \frac{n-1}{n+1}
```

For seven, eleven and twenty observations, the mathematical results are approximately 75%, 83% and 90%.

But those are unconditional coverage probabilities under assumptions such as exchangeable, continuously distributed observations. They do not establish that a particular software delivery range has a reliable conditional forecast, especially when tasks differ and the team or tools change.

And eleven to twenty observations are not enough, by themselves, to justify well-calibrated P85 and P95 delivery forecasts.

I would use the following revised levels:

| Level | Definition | What can be reported |
| --- | --- | --- |
| F0 | Insufficient definition or evidence | No delivery estimate |
| F1 | Judgment or analogous work | Explicit planning scenarios |
| F2 | Relevant measured delivery history | Empirical ranges, uncertainty and sample count |
| F3 | Probabilistic forecast with demonstrated calibration | P50/P85/P95 dates, model assumptions and performance |

Do not establish universal sample-count thresholds as formal conformance rules. Require adequate comparable observations, a stable enough process, transparent sample size and repeated back-testing. Define statistical acceptance criteria for each model.

Small samples can be used for exploratory forecasting. They simply should not be represented as reliable statistical guarantees.

### 4. Replace "Capacity-bound" with "Constraint-aware"

I agree that verification capacity is important. I disagree that it must always be the hard constraint.

In one team, review is the bottleneck. In another, it is customer access, architectural decision-making, deployment approval, integration or legal clearance.

Little's Law explains relationships between work in progress, throughput and flow time in a stable system. It does not prove that every AI-native team has a verification bottleneck.

I recommend:

> **C = Constraint-aware.** The team identifies its current limiting capacity and controls work in progress accordingly.

When review is constrained, limit work entering review. When product decisions are constrained, stop producing implementation options that nobody is ready to evaluate.

This makes the methodology more durable as AI capabilities evolve.

### 5. Separate delivery completion from outcome resolution

v0.2 says a delivery item is only done once its outcome review has occurred.

That would create problems for forecasting. A feature may be technically complete today but need six weeks of customer behaviour before its impact can be assessed.

Instead, maintain separate states.

| Lifecycle | States |
| --- | --- |
| Delivery lifecycle | Ready → Building → Verifying → Accepted |
| Outcome lifecycle | Proposed → Active → Measuring → Resolved |

Accepted delivery contributes to engineering throughput immediately. The associated product bet remains open until the outcome is evaluated.

A bet can be resolved as validated, invalidated, inconclusive or superseded.

Invalidation is a legitimate learning result. It does not automatically mean a feature should be removed: sometimes the hypothesis was wrong but the functionality remains necessary or valuable.

### 6. Make the Bet requirement proportionate

Not every planned item is an experiment.

A new market-facing product feature can have a hypothesis and a stopping rule. A mandatory security fix or regulatory requirement generally cannot be abandoned because its commercial results fall below target.

I recommend distinguishing:

- **Bet:** Discretionary investment under uncertainty, with a hypothesis, appetite, decision criterion and review date.
- **Obligation:** Required work with an accountable owner, acceptance standard, deadline if applicable and risk consequences.
- **Improvement:** Operational or product enhancement with an observable benefit and proportionate evidence requirements.

Every initiative should have a clear reason to exist, but it need not have an artificially constructed experiment.

Also, a bet's review criterion must be statistically and operationally sensible. In the checkout example, a trial-to-paid change from 4% to 6% may be too small to assess meaningfully in eight weeks if the startup has very few trial users.

### 7. Loosen the specification rules

I support versioned, agent-readable context. However, mandating that every team maintain product context, decision records and slice specifications in a repository is too restrictive.

A founder building with Lovable might initially use a managed project workspace. A larger organisation may maintain strategy in Linear or Productboard and technical decisions in GitHub.

The better conformance rule is:

> Every active slice must have an authoritative, accessible and versioned source of intent, constraints and acceptance evidence, readable by the responsible humans and agents.

Repository storage should be the preferred implementation for code-related context, not the only compliant one.

Likewise, a context document being older than the code is not automatically a defect. The meaningful question is whether changes have made it inaccurate.

### 8. Correct the verification policy for solo founders

v0.2 mandates independent human review for high-risk changes.

That is a desirable safeguard, but a solo founder cannot independently review their own work.

For high-consequence changes, the method should prescribe an appropriate independent reviewer or specialist assurance process before exposing real users, money or sensitive data. Where independence cannot be obtained, the risk must be explicitly managed; self-review or a second agent must not be misrepresented as independent approval.

This matters particularly for payments, access control, production data migrations and sensitive personal information.

## 4. One more research correction: the AI engineering evidence is evolving

The v0.2 Faros figures are real, but they describe its earlier 2026 research snapshot.

Faros subsequently published its Q3 2026 Speed Trap report, with a changed pattern:

| Metric | Q2 2026 finding | Q3 2026 finding |
| --- | --- | --- |
| Incidents per pull request | +242.7% | +14.5% |
| PRs merged with no review | +31.3% | +76.3% |
| Average time in QA | — | +300.6% |
| Work restarts per developer | — | +66.7% |

Reported associations for high AI adoption in Faros's observed populations, not universal causal effects. The unreviewed-merge percentages are relative increases, not the percentage of all PRs merged without review.

This reinforces the need for SLICE to track the entire delivery system, not to optimise permanently around one presumed bottleneck.

It also illustrates why the methodology should avoid a rigid universal AI productivity estimate. Both tool capability and the surrounding engineering practices are changing.

The Stanford/Denisov-Blanch findings likewise support the importance of codebase complexity, but the cited greenfield/brownfield percentages should be described as indicative findings from the studied population, not as general forecasting multipliers.

## 5. The proposed final vocabulary

This is the terminology I would freeze for v0.3.

| Concept | Official term | Meaning |
| --- | --- | --- |
| Entire methodology | SLICE Framework | The integrated operating model |
| Strategic view | SLICE Roadmapping | Direction, opportunities, initiatives and commitments |
| Estimation method | SLICE Forecasting | Size, uncertainty, capacity and delivery forecasts |
| Investment decision | Bet | A testable discretionary investment |
| Mandatory work | Obligation | Required capability, protection or change |
| Feature delivery unit | Slice | Smallest useful, independently verifiable increment |
| Resource decision | Appetite | Maximum justified investment for a bet |
| Planning approach | Proportionate Planning | Planning depth follows uncertainty and consequences |
| Validation activity | Experiment | Least costly credible method for reducing uncertainty |
| Delivery safeguard | Verification | Evidence that the implementation satisfies acceptance requirements |
| Governing constraint | Capacity constraint | The current limit on effective delivery flow |
| Forecast reliability | Evidence level | F0–F3 |
| External roadmap promise | Commitment type | Direction, Target or Commitment |
| Commercial assessment | Outcome review | Decision whether to continue, change or stop an investment |
| Actual economic efficiency | Delivery economics | Human effort, tooling cost, rework and value |

I would also distinguish accepted software from validated product value consistently throughout the guide.

## 6. Finalise the SLICE acronym

| Letter | Principle | Meaning |
| --- | --- | --- |
| S | Strategic | Start with customer outcomes, investment choices and necessary obligations. |
| L | Lightweight | Minimise coordination overhead; preserve necessary decision-making and assurance. |
| I | Iterative | Build, test, decide and adapt in small, evidence-generating increments. |
| C | Constraint-aware | Manage work according to the system's actual limiting capacity. |
| E | Evidence-driven | Ground forecasts, delivery claims and product decisions in observable evidence. |

I prefer this to the v0.2 expansion because it adapts to whichever bottleneck becomes dominant, while retaining verification as a non-negotiable quality requirement.

The full expression should be five principles. Execution is what the framework governs, not a sixth letter hidden in the acronym.

## 7. The v0.3 operating specification

The fundamental process should remain exceptionally simple: Decide → Shape → Forecast → Build → Verify → Learn, with evidence updating decisions and forecasts.

The operating rules I would adopt are:

- Every initiative identifies a customer outcome, operational improvement or necessary obligation.
- Discretionary investments have a hypothesis, appetite, decision owner and explicit review criterion.
- Planning intensity follows risk, uncertainty and the cost of reversal.
- Every scheduled feature is decomposed into independently verifiable slices.
- Each slice records size, dominant risks, AI leverage and forecast evidence level.
- Forecasts use measured comparable work where possible, and never assume a universal AI acceleration multiplier.
- Work in progress is controlled by the actual delivery constraint, with risk-appropriate verification.
- Delivery completion and outcome validation are tracked separately.
- Roadmap dates distinguish Direction, Target and Commitment, with evidence levels made visible.
- Historical delivery, total cost, quality and outcome evidence continually update future decisions.

The first application should work with a small number of cards, basic status transitions and minimal manual recordkeeping. Automated collection should handle timestamps and recurring measurements wherever practical.

### Minimum records for a solo founder

For a one-person team, I would start with only three kinds of objects:

- **Roadmap item:** Outcome or obligation, priority, Now/Next/Later, owner, investment appetite and commitment type.
- **Slice card:** What changes, acceptance evidence, size, risk, estimated range, execution mode and delivery state.
- **Evidence record:** Actual completion, verification results, relevant costs and what the team learned.

A team of twenty-five would still use these same core objects, adding dependency governance and portfolio aggregation rather than forcing every small team to adopt more administration.

## 8. What can legitimately be claimed as new?

The research makes one point especially clear: outcome-led product discovery is not new. Hypothesis testing, small experiments, limiting work in progress and empirical forecasting all have established histories.

Scrum.org's Evidence-Based Management, for example, already includes customer value, time to market, experimentation and organisational ability to innovate.

The proposed innovation is therefore not any individual practice. It is the specific combination and operating contract that links them in an AI-assisted delivery environment.

The community-facing claim should be:

> SLICE connects product decisions, proportionate planning, AI-assisted execution, verified delivery and evidence-based forecasting in one lightweight framework. It is designed for small teams first, with the same principles applicable to larger organisations as coordination requirements grow.

I would not yet claim that SLICE is the first framework to connect these concepts. That requires a much more exhaustive literature and implementation review than a web landscape scan can establish.

## 9. Naming verdict

The framework name is the one decision I would deliberately leave provisional.

Keep SLICE for the v0.3 working specification. It is memorable, understandable and closely related to the central unit of delivery.

Do not treat SLICE as a cleared public brand. SliceOps, existing AI slice-planning tools and widespread use of vertical-slice terminology create discoverability and potential distinctiveness problems.

Clear the final name separately. Check EUIPO, USPTO, relevant domains and existing open-source projects before establishing a public identity. A preliminary web search cannot establish legal availability.

The distinction between a methodology's name and its underlying ideas is important. We can validate the method without committing prematurely to branding.

## 10. My final verdict

| Status | Items |
| --- | --- |
| Accept from v0.2 | Separation of coordination, decisions and verification; explicit investment bets; agent-readable specifications; review-capacity management; empirical forecasting; outcome reviews; and stronger research attribution. |
| Revise for v0.3 | Economic vocabulary, proportionate planning, test-to-decide, forecast evidence thresholds, constraint-aware flow, separate delivery/outcome states, risk-based verification and public differentiation. |
| Keep open | Public brand clearance, statistical calibration requirements, and whether the combined method demonstrably outperforms existing approaches. |

The resulting methodology has a coherent thesis, a clear roadmap structure, an estimation mechanism, a vocabulary and a practicable operating model.

What it still lacks is empirical evidence that the integrated process improves decision quality, lowers total delivery cost or creates more reliable forecasts. Those are the claims its pilots must test.

I would freeze the above as SLICE v0.3 for practical testing, but not as a final public standard. The most valuable next milestone is not another round of adding rules; it is proving that a small AI-first team can apply these rules with minimal administrative overhead, and that the outcomes are measurably better.

That would give the framework the foundation for a credible community proposal.
