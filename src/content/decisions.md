# Decision log

**Every framework decision keeps its row, including those later revised, superseded or rejected.** Notes point to the decision that replaced it.

| # | Decision | Introduced | Status | Notes |
| --- | --- | --- | --- | --- |
| D1 | SLICE as the working name; public name decided before going public | v0.1 | Active | Narrowed by D28 |
| D2 | Five-level hierarchy: Outcome → Initiative → Feature → Slice → Agent work | v0.1 | Active | |
| D3 | Now / Next / Later, with a team-defined commitment boundary | v0.1 | Active | |
| D4 | XS–XL sizes with no fixed hour equivalents | v0.1 | Active | |
| D5 | AI leverage is a forecast input, never a multiplier | v0.1 | Active | Reaffirmed in v0.2 and v0.3 |
| D6 | F0–F3 forecast evidence levels | v0.1 | Revised | Revised by D18 |
| D7 | Direction / Target / Commitment | v0.1 | Active | v0.2 adds evidence level to dates; v0.3 adds sample count |
| D8 | Planning Budget with modes 0–3 | v0.1 | Superseded | By D10, then D15 |
| D9 | Split planning into coordination, decision and proof | v0.2 | Revised | v0.3 adds learning as a fourth kind of work |
| D10 | Decision Budget with Mode B, Build to decide | v0.2 | Superseded | By D15 |
| D11 | Every Now/Next initiative is a Bet with a kill criterion | v0.2 | Revised | Revised by D17: only discretionary work is a Bet |
| D12 | Capacity-bound: verification capacity as the hard WIP limit | v0.2 | Superseded | By D16 |
| D13 | Specs as agent context, stored in the repository | v0.2 | Revised | Revised by D19 |
| D14 | Scope limited to teams of 1–25 | v0.2 | Active | |
| D15 | Proportionate Planning with Mode E, Experiment to decide | v0.3 | Active | |
| D16 | Constraint-aware flow; verification as default constraint and risk floor | v0.3 | Active | |
| D17 | Bet / Obligation / Improvement, with separate delivery and outcome lifecycles | v0.3 | Active | |
| D18 | Sample minimums are floors; F3 needs back-tested calibration; no P95 for small teams | v0.3 | Active | |
| D19 | One authoritative, accessible, versioned source of intent per slice | v0.3 | Active | |
| D20 | Solo high-risk work: reduce consequence by design, then specialist review | v0.3 | Active | |
| D21 | Cost per validated outcome as an economics metric | v0.3 review | Rejected | Denominator too small and too dissimilar for small teams |
| D22 | Thesis "AI accelerates implementation, but valuable delivery still depends on…" | v0.3 review | Rejected | Rests on a contested claim and is not testable |
| D23 | Remove all forecast sample minimums | v0.3 review | Rejected | Kept as floors instead (D18) |
| D24 | Treat "SliceOps" as unverified and exclude it | v0.3 | Superseded | By D25: SliceOps verified at sliceops.org |
| D25 | Position SLICE on investment, forecasting and outcomes, distinct from SliceOps' execution audit | v0.3.1 | Active | |
| D26 | Release alpha corrections as patch v0.3.1; reserve v0.4 for alpha learnings | v0.3.1 | Active | No rule changed |
| D27 | Start the alpha with invited teams now; go public after name clearance | v0.3.1 | Active | Proposed by Anthropic's models; Milber to confirm |
| D28 | Public name not yet decided; SLICE remains the working name | v0.3.1 | Active | Anthropic's models recommend a new name (Pensum); the decision is Milber's |
| D29 | Pilot thresholds are exploratory; F3 is unavailable during the alpha | v0.3.1 | Active | |

## Open questions for the next version

- [ ] Choose the public name: Pensum is the front-runner, pending EUIPO, USPTO, GitHub, npm and domain checks.
- [ ] Privacy review of the pilot data-handling note.
- [ ] Confirm licences (CC BY 4.0 for the spec, MIT for templates and code).
- [ ] Statistical acceptance criteria for each F3 forecast model.
- [ ] Whether SLICE measurably beats a team's previous process (pilot hypotheses H1–H6).
- [ ] Whether decision latency and coordination minutes can be captured from timestamps alone.
- [ ] Confirmation of the Faros +14.5% incidents-per-PR figure.
- [x] A source for "SliceOps": found at sliceops.org; v0.3 was wrong.
