# Decision log

**Every framework decision keeps its row, including those later revised, superseded or rejected.** Notes point to the decision that replaced it.

| # | Decision | Introduced | Status | Notes |
| --- | --- | --- | --- | --- |
| D1 | SLICE as the working name; public name decided before going public | v0.1 | Superseded | By D30 |
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
| D27 | Start the alpha with invited teams; go public once the name is decided | v0.3.1 | Superseded | By D30: the name is decided and the repository is public |
| D28 | Public name not yet decided; SLICE remains the working name | v0.3.1 | Superseded | By D30. A new name (Pensum) was recommended in the naming assessment and not chosen |
| D29 | Pilot thresholds are exploratory; F3 is unavailable during the alpha | v0.3.1 | Active | |
| D30 | The public name is SLICE; no trademark claim to the word; not affiliated with SliceOps | v0.3.2 | Active | Chosen by Milber over the alternatives in the naming research |
| D31 | Lead all public copy with what SLICE is for: planning and estimating software when AI writes the code. Keep "AI" out of the name | v0.3.2 | Active | The name should outlast the label; the message should not hide the reason SLICE exists |
| D32 | Quick estimate as the default way to start: four judgment ranges summed into an F1 range. Default ranges are starting suggestions, not data | v0.3.2 | Active | The full forecast stays for teams with measured history |

## Open questions the alpha should answer

These are the questions only real teams can answer. Results go into the alpha report and v0.4. To contribute evidence, [open a pilot report or specification feedback issue](https://github.com/reblim/slice-framework/issues/new/choose).

1. **Does SLICE beat a team's previous way of working?** Pilot hypotheses H1–H6 test decision latency, coordination time, calibration, outcome reviews, the work-in-progress rule and overhead.
2. **Are the quick-estimate starting ranges realistic?** How much review, decision and waiting time do slices at each risk tier actually take?
3. **Can decision latency and coordination time be measured from timestamps alone,** without anyone logging time by hand?
4. **What should calibrate F3?** Which statistical test must a probabilistic forecast pass before teams may report P50 and P85?
