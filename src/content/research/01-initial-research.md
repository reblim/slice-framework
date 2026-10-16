# Modern Product Roadmapping for AI-Driven Teams

Research and proposed operating model · October 2026

> **By Milber Ferreira, with ChatGPT.** The research behind v0.1 and v0.2, reproduced as written; formatting converted to Markdown. Interactive elements (an estimate explorer and a forecast chart) survive only as text. The document ends partway through section 12, as received.

## Executive recommendation

The traditional Scrum backlog, story points, sprint planning and Gantt charts were designed around a relatively predictable relationship between human development effort and delivered software.

AI-assisted engineering changes that relationship.

A feature that previously required several days of frontend development might now have a working implementation in hours using Lovable, Claude Code or Cursor. Yet authentication, architectural decisions, data migrations, testing, security and deployment can still take days or weeks.

My recommendation is a hybrid operating model combining six established practices:

| Practice | Purpose |
| --- | --- |
| Outcome-based roadmaps | Communicate what the product should achieve, rather than a long list of promised functionality. |
| Hierarchical features and T-shirt sizing | Organise initiatives, large features and small deliverable slices without estimating hundreds of individual tasks. |
| AI-aware effort and risk assessment | Separate work AI can accelerate from engineering complexity, integration and verification. |
| Capacity-based probabilistic forecasting | Use actual completed work, dependencies and uncertainty to produce plausible delivery windows. |
| Now / Next / Later and milestone commitments | Show near-term delivery plans alongside medium- and long-term strategic direction. |
| Continuous forecasting and evidence-based reporting | Update estimates as the team learns how quickly it delivers production-ready functionality. |

This is not an existing, formally standardised methodology. It is a proposed synthesis designed for a small, AI-native product organisation.

The core principle is:

> Estimate complexity relatively. Forecast delivery empirically. Communicate commitments with explicit confidence.

## 1. What research tells us about AI-assisted engineering

The strongest reason not to simply divide traditional estimates by three or five is that AI productivity is not a constant multiplier.

Research provides a more nuanced picture.

| Source | Finding | Detail |
| --- | --- | --- |
| DORA · 2025 research | Higher throughput, but stability risks | AI can increase software delivery throughput while introducing more instability. Strong engineering practices, small batches and quality systems remain essential. |
| METR · July 2025 | 19% slower in one controlled study | In a study involving experienced open-source developers working on familiar, mature repositories, access to early-2025 AI tools increased task completion time by approximately 19%. |
| METR · February 2026 follow-up | Later tools may improve performance | Subsequent observations suggested potentially greater acceleration from newer agents, but the researchers explicitly warned that selection effects prevented a reliable general speedup estimate. |

These findings do not mean AI coding tools are ineffective. They mean the effect depends on the work, team, codebase and definition of completion.

For example, generating a dashboard with Lovable and delivering a secure, reliable, production-ready financial dashboard are different engineering outcomes.

That distinction should be built into the estimation model from the beginning.

## 2. Comparison of existing roadmap and estimation methodologies

No single established method covers strategy, prioritisation, development effort, probabilistic forecasting and investor communication equally well.

The most useful approaches fall into four groups.

### A. Roadmapping and planning

| Method | Strength | AI-native suitability |
| --- | --- | --- |
| Now / Next / Later | Direction without false date commitments | Excellent |
| Outcome-based roadmaps / OKRs | Links engineering work to business results | Excellent |
| Theme-based roadmaps | Organises large strategic investments | Excellent |
| Feature-based roadmaps | Makes deliverables concrete | Good for internal use |
| Gantt charts | Shows hard dependencies and deadlines | Selective use |
| Shape Up | Fixed time appetite, flexible scope | Excellent |
| Scrum | Iterative delivery and feedback | Good, but optional |
| Kanban | Continuous flow and low administrative overhead | Excellent |
| Dual-track Agile | Separates discovery and delivery | Excellent |
| Continuous discovery | Reduces the risk of building unwanted features | Excellent |

The most important distinction is that Scrum does not require story points or planning poker. These are optional estimation techniques. The official guidance allows teams to use relative sizes, elapsed-time estimates or flow metrics.

### B. Estimation and forecasting

| Technique | Primary purpose | Recommendation |
| --- | --- | --- |
| T-shirt sizing | Fast relative comparison | Adopt |
| Fibonacci story points | Relative delivery effort | Optional |
| Planning Poker | Group estimation and disagreement detection | Use selectively |
| Three-point / PERT estimation | Optimistic, likely and pessimistic scenarios | Adopt for uncertain work |
| Reference-class forecasting | Forecast from comparable historical work | Adopt |
| Throughput forecasting | Forecast using completed item counts | Adopt |
| Monte Carlo simulation | Probability-based dates | Adopt once data exists |
| Cycle-time percentiles | Predict how long an item may take | Adopt |
| Little's Law | Understand WIP, throughput and cycle time | Use diagnostically |
| Critical-path analysis | Identify schedule-driving dependencies | Adopt for launches |
| No-estimates approach | Reduce estimation overhead | Useful for small, uniform items |
| Function points / COSMIC | Functional size measurement | Specialist use |
| COCOMO / traditional cost models | Effort and cost estimation | Poor default for AI-native startups |

### C. Prioritisation

| Technique | Best use | Recommendation |
| --- | --- | --- |
| RICE | Comparing features by reach, impact, confidence and effort | Primary method |
| ICE | Rapid, lightweight early-stage decisions | Useful alternative |
| WSJF / Cost of Delay | Time-sensitive economic decisions | For strategic sequencing |
| MoSCoW | Defining essential vs optional scope | Release planning |
| Kano | Understanding basic, performance and delight features | Product discovery |
| Opportunity Solution Trees | Connecting outcomes, opportunities and solutions | Strongly recommended |
| Value vs Effort matrix | Fast visual portfolio decisions | Excellent for workshops |
| Impact Mapping | Tying features to behaviours and outcomes | Useful |
| Buy-a-Feature / stakeholder voting | Exposing relative preferences | Supporting method, not the sole decision rule |

RICE is particularly useful because effort is only one part of the prioritisation decision. Its original model is:

```latex
\text{RICE}=\frac{\text{Reach}\times\text{Impact}\times\text{Confidence}}{\text{Effort}}
```

But the effort denominator must represent actual team effort, not an arbitrary T-shirt label. Intercom's original model uses person-months.

### D. Execution and engineering performance

For AI-native teams, I would take the most useful concepts from Kanban and DORA: throughput, cycle time, work in progress, change failure, deployment performance and rework.

The important improvement is to measure production-accepted feature slices, not lines of generated code, number of prompts, number of agent sessions or pull requests.

ProKanban identifies throughput, cycle time, WIP and work item age as its four core flow metrics.

## 3. The hierarchy: from strategic initiatives to AI-executable work

This is how I would structure a modern product roadmap.

| Level | Name | Example |
| --- | --- | --- |
| 1 | Strategic outcome | Convert more visitors into paying customers |
| 2 | Initiative / epic | Self-service subscriptions |
| 3 | Feature | Subscription checkout (L); Billing management (M) |
| 4 | Deliverable slice | Checkout UI; Stripe integration; Webhook handling; Payment verification |
| 5 | Agent execution | Implementation prompts, code changes, tests and reviews (Lovable · Claude Code · Cursor · Codex) |

The benefit is that leadership operates at levels 1–3, engineering forecasts level 4, and AI agents execute level 5.

You do not need to put every agent instruction into the product roadmap.

A large feature should not be represented as one huge task either. It becomes a parent containing smaller, independently verifiable deliverables.

## 4. A practical T-shirt sizing system

I would use five primary sizes: XS, S, M, L and XL. Anything larger becomes an initiative, not an executable feature.

The following are illustrative starting ranges, not industry benchmarks or validated AI development estimates.

| Size | Example | Initial elapsed-time planning range* |
| --- | --- | --- |
| XS | Label, minor UI adjustment, simple validation | 0.25–1 day |
| S | Small form, settings change, basic UI flow | 1–3 days |
| M | Functional dashboard, bounded workflow | 3–7 days |
| L | Multi-screen feature with backend and integration | 1–3 weeks |
| XL | Complex subsystem involving several services | 3–6+ weeks; split before committing |

*Working-day ranges for a small, AI-assisted team with adequate existing infrastructure, including review and verification. They deliberately overlap. Calendar duration depends on staffing, dependencies and parallel work. Replace these ranges with your own observed distribution as quickly as possible.

This scale is useful for early conversations, but size alone is inadequate.

Consider two medium-sized features:

- **Analytics dashboard (M)** — Mostly frontend, established components, simple API queries. High AI leverage.
- **Payment reconciliation (M)** — Backend workflows, money, failure states, webhook retries. High verification risk.

Both may appear to have similar functional scope, but they should not receive the same confidence or necessarily the same forecast.

### Add two separate dimensions

I recommend recording a feature as:

```markdown
EXAMPLE FEATURE ESTIMATE

Subscription checkout
Size: L    AI leverage: High    Risk: High
Confidence: Medium
Delivery window: 2-3 weeks
Blocker: Payment-provider test environment and production webhook configuration.
```

The key is to avoid letting the AI-leverage score conceal technical risk.

A feature can be very easy for an agent to generate and still difficult to deliver safely.

## 5. How to estimate development with AI agents

I propose a model that estimates human-supervised delivery effort, not AI generation time.

Break each feature into six engineering components.

| Component | What it covers | AI acceleration potential |
| --- | --- | --- |
| Discovery & specification | Requirements, workflows, acceptance criteria | High |
| UX & interface | Screens, interactions, copy, design system | High |
| Implementation | Frontend, backend, business logic | Variable; often high |
| Integration | APIs, authentication, database, external services | Medium |
| Verification & hardening | Testing, security, accessibility, defects | Medium to low |
| Deployment & operations | CI/CD, migrations, monitoring, release | Medium |

These are qualitative hypotheses about tool suitability, not measured productivity multipliers.

### An interactive estimation example

This model demonstrates how a feature can be assessed before the team has sufficient historical data.

**Feature estimate explorer** (interactive in the original; text as received). Illustrative calibration model. Factors and baseline ranges are editable planning assumptions, not validated industry statistics. Inputs: feature size (XS, S, M, L, XL); expected AI leverage (Low, Medium, High); integration and delivery risk (Low, Medium, High); productive delivery days per calendar week (3 days). Example output: estimated effort range 3.0–7.0 productive workdays; indicative calendar range 1.0–2.3 weeks, assuming one delivery owner.

The model assumes a bounded, ready-to-build feature with no external waiting time. Calendar conversion is only a capacity approximation. It is not a probability interval, and it does not model dependencies or parallel activities.

This is useful during initial planning, but I would not retain fixed multipliers as a long-term forecasting system. They should be replaced by actual task distributions for comparable types of work.

### A better long-term mechanism: historical reference classes

After sufficient work has been completed, group comparable deliveries by:

- Size: XS–XL.
- Work type: UI, data, integration, AI/LLM, infrastructure.
- Codebase maturity: greenfield versus established.
- Risk: low, medium, high.
- Execution approach: Lovable-led, coding-agent-led, hybrid or primarily manual.

For example, suppose the team has delivered 30 medium-sized features. Instead of relying on a generic estimate of 3–7 days, use its recorded completion-time distribution.

Then report something like:

> Medium frontend features: 50% finish within four working days; 85% finish within seven.

Those figures are hypothetical. Once derived from actual delivery data, however, they become credible service-level expectations.

An important subtlety: do not convert a size scale into fake numerical precision, such as XS = 1, S = 2, M = 4, L = 8 and assume the team can complete exactly 30 units per week. Relative complexity, human effort and elapsed time are different quantities.

## 6. Turning sizes into realistic dates

This is the part that founders and investors actually need.

I would use three forecasting stages.

### Stage 1 — Before delivery data exists

Use expert judgment, analogous feature examples, three-point estimates and explicit dependencies.

Provide ranges as scenarios rather than claiming statistically calibrated confidence.

For example:

| Scenario | Launch projection |
| --- | --- |
| Optimistic | 4 weeks |
| Expected | 6 weeks |
| Conservative | 9 weeks |

These are planning scenarios, not necessarily P10, P50 and P90 probabilities.

### Stage 2 — After 4–8 weeks of deliveries

Begin tracking flow data:

| Measure | Illustrative value | Meaning |
| --- | --- | --- |
| Throughput | 6 | Accepted slices/week |
| Median cycle time | 3.5d | Start to accepted completion |
| 85th percentile | 8d | Individual slice completion |
| Escaped defects | 2 | Production defects requiring rework |

All values above are illustrative, not measurements of an actual team.

A few weeks of data can improve planning, but the sample may still be small and unrepresentative.

### Stage 3 — Probabilistic forecasting

Once there is a stable history of comparable work, run Monte Carlo simulations using historical throughput or cycle-time distributions.

The question changes from:

> "When will we definitely finish these 20 features?"

to:

> "What date gives us an 85% modeled probability of finishing the current scope?"

**Example: cumulative completion forecast** (chart in the original). Three possible cumulative trajectories for an illustrative backlog. A real forecast would be generated from historical throughput observations, with uncertainty bands correctly calculated from simulation outputs.

A probabilistic forecast becomes much more useful when it can incorporate scope changes, dependencies, capacity reductions and different classes of work.

For heterogeneous work, do not treat an XS copy change and an XL migration as equal throughput units. Either split work into similarly sized deliverable slices or sample completion distributions separately by class.

## 7. The roadmap founders and investors should see

I would maintain one underlying product dataset with three views.

### View 1 — Strategic roadmap (Investor / Board)

| Horizon | Theme | Aim |
| --- | --- | --- |
| NOW | Acquisition & activation | Reduce friction in the first-user journey |
| NEXT | Monetisation | Establish self-service paid conversion |
| LATER | Expansion | Support additional markets and customers |

Communicates investment direction, outcomes, strategic dependencies and confidence.

### View 2 — Delivery roadmap (Founder / Product)

| Item | Size | Window |
| --- | --- | --- |
| Onboarding improvements | M | W1–W2 |
| Subscription checkout | L | W2–W5 |
| Billing self-service | M | W4–W6 |

Illustrative progress. In a real roadmap, prefer accepted deliverables over subjective percentage-complete measures.

### View 3 — Execution board (Engineering / Agents)

| Ready | Building | Verify |
| --- | --- | --- |
| Checkout states | Stripe adapter | Payment tests |
| API contract | Webhook handler | RLS review |

Agent tasks, implementation details, tests, review status and blockers.

This supports the Now / Next / Later approach developed by Janna Bastow at ProdPad. Its purpose is to represent decreasing certainty over longer planning horizons rather than turning every aspiration into a dated promise.

### Recommended confidence policy

| Horizon | Timeframe | Appropriate communication |
| --- | --- | --- |
| Now | 0–4 weeks | Scoped deliverables; delivery ranges and accountable owners |
| Next | 1–3 months | Target windows, assumptions, major dependencies |
| Later | 3–12 months | Strategic themes, possible milestones, no false commitments |

These horizons are configurable. A two-person startup and a 50-person engineering organisation should not necessarily use the same boundaries.

For investor reporting, include the forecast date, confidence basis, historical evidence, key risks and material changes since the previous update.

**Important:** A release forecast and a business outcome forecast are not the same. A team may have 85% confidence that a feature will be delivered but much lower confidence that it will increase revenue by 15%. Report these separately.

## 8. Mapping the operating model to AI engineering tools

I would not assign complexity estimates based solely on the selected AI tool. Instead, assign tools to workflows where their capabilities are most useful and measure their results.

| Workflow | Suitable AI tools | Human responsibility |
| --- | --- | --- |
| Product discovery | ChatGPT, Claude, Perplexity | Validate customer evidence |
| Requirements and specifications | ChatGPT, Claude | Decide scope and acceptance criteria |
| UX exploration and prototypes | Lovable, Figma AI, Claude | UX quality and design decisions |
| Frontend implementation | Lovable, Cursor, Claude Code, Codex | Review architecture and implementation |
| Backend engineering | Claude Code, Cursor, Codex | Business logic, data integrity, security |
| Refactoring and migrations | Claude Code, Cursor, Codex | Migration safety and compatibility |
| Test generation | Claude Code, Cursor, Codex | Test quality and completeness |
| Automated code review | Codex, Claude Code, Cursor | Final quality ownership |
| Release automation | GitHub Actions, CI/CD, agent scripts | Approvals, rollout and rollback |
| Roadmap planning | Linear, Jira, GitHub Projects, Notion | Prioritisation and forecasting |

This is a capability-based allocation, not a vendor ranking. The tools are evolving rapidly.

A useful practical distinction:

- **Lovable-led work:** visual interfaces, prototypes, conventional CRUD workflows, rapid feedback loops.
- **Claude Code / Cursor / Codex-led work:** repository-wide changes, complex business logic, tests, migrations, infrastructure and deeper integrations.
- **ChatGPT / Claude-led product work:** problem framing, competitive analysis, feature decomposition, acceptance criteria, risk assessments and stakeholder communication.

Cursor's repository rules and OpenAI Codex's agent instructions support the broader principle of giving coding agents persistent project-specific context rather than repeating requirements in every prompt.

### Recommended AI-assisted delivery lifecycle

1. **Frame** — Define the customer problem, outcome, priority and constraints.
2. **Shape** — Break the initiative into bounded, independently deliverable features.
3. **Assess** — Assign a T-shirt size, AI leverage, risks and forecast assumptions.
4. **Build** — Delegate bounded implementation work to suitable AI agents.
5. **Verify** — Run tests, security checks, UX review and integration checks.
6. **Release** — Merge, deploy, monitor and confirm acceptance.
7. **Learn** — Capture actual duration, rework, defects and outcome evidence.

A feature is only complete when it has met the team's Definition of Done, not when an AI agent reports that it has finished.

That Definition of Done should explicitly cover acceptance criteria, automated checks, relevant security tests, data integrity, deployment and operational observability. An agent's self-review is useful, but it is not independent assurance.

OpenAI's published practices for Codex similarly emphasise documented plans, continuous verification and explicit approval boundaries.

## 9. The operating cadence I would actually implement

I would combine continuous Kanban flow with a lightweight version of Shape Up.

Shape Up's original model uses six-week cycles and a defined investment appetite, rather than treating estimates as unlimited commitments. Its central question is how much time a team is willing to spend solving a problem.

For a small AI-native team, my adaptation would be:

| Frequency | Activity | Output |
| --- | --- | --- |
| Continuous | Agent execution, testing and deployment | Accepted slices |
| Weekly, 20–30 min | Review progress, blockers, risks | Updated delivery forecast |
| Every 2 weeks | Shape and prioritise upcoming work | Ready feature queue |
| Every 4 weeks | Review roadmap, capacity and outcomes | Founder delivery report |
| Quarterly | Reassess strategy, investments and major milestones | Investor roadmap |

For small teams, I would normally limit active work to one major initiative plus a small number of independent improvements. Running five agents simultaneously does not mean the product team has five times the review, integration or decision-making capacity.

## 10. Example: a modern startup roadmap

The following is a hypothetical SaaS product, illustrating how large and small features can be combined into a credible release plan.

**Illustrative release plan: launch a self-service SaaS MVP.** One product lead and one engineering lead, supported by AI tools. All dates are provisional.

| Feature | Size | Target | Risk |
| --- | --- | --- | --- |
| Marketing homepage | S | W1 | Low |
| Authentication | M | W1–2 | Med |
| User onboarding | M | W2–3 | Med |
| Core user dashboard | L | W2–5 | Med |
| Stripe subscriptions | L | W4–7 | High |
| Email notifications | S | W5–6 | Low |
| Account settings | S | W6–7 | Low |
| Security and release QA | L | W7–9 | High |

Provisional launch window: Week 8–10. Planning assumption, not a calibrated probability forecast. Payment integration and release verification are potential critical-path activities.

A key advantage of this representation is that investors can see the intended business milestone, while the team can still reshuffle small features or reduce scope without rewriting the entire strategy.

## 11. The data model behind a serious roadmap

Each feature should contain enough structured information to support prioritisation, execution, forecasting and reporting automatically.

I recommend the following minimum fields.

| Field | Purpose |
| --- | --- |
| ID and parent ID | Feature hierarchy |
| Title and description | Scope |
| Strategic outcome | Why it matters |
| Customer problem | Value hypothesis |
| Success metric | Expected impact |
| Priority / RICE | Ordering |
| T-shirt size | Relative complexity |
| Work category | Reference-class forecasting |
| AI leverage | Expected agent suitability |
| Risk and unknowns | Forecast reliability |
| Dependencies | Critical-path analysis |
| Acceptance criteria | Definition of completion |
| Owner | Accountability |
| Status | Current workflow state |
| Forecast range | Expected delivery window |
| Forecast confidence | Strength of evidence |
| Actual dates | Calibration |
| Actual human effort | Capacity and cost analysis |
| AI/tool cost | Execution economics |
| Defects and rework | Quality of delivery |

One enhancement I would make is to add estimation provenance: record whether an estimate came from expert judgment, a comparable feature, an AI recommendation or historical statistical analysis.

Otherwise an AI-generated estimate can become indistinguishable from a measured forecast.

The AI should be able to suggest feature decompositions, identify unknowns and flag contradictions, but it should never silently turn speculative estimates into high-confidence commitments.

## 12. How to manage this using existing software

There is no compelling reason to build an entirely new planning platform before validating the operating model.

*(The document as received ends here.)*
