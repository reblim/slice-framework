# Templates: the three records

**Three Markdown files with YAML front matter: readable by people, parseable by agents and scripts.** Copy them into your repository (for example `slice/`), your issue tracker or your notes tool.

## roadmap-item.md

```markdown
---
id: RI-001
type: bet                # bet | obligation | improvement
title: Self-serve checkout
horizon: now             # now | next | later
decider: founder
appetite: 3 weeks of verified delivery
commitment: target       # direction | target | commitment
outcome_state: proposed  # proposed | active | measuring | resolved
resolution:              # validated | invalidated | inconclusive | superseded
review_date: 2026-12-15
---

## Why it exists

Bet: hypothesis, evidence today, decision criterion (continue if ... ; stop if ...).
Obligation: acceptance standard, deadline, consequence of missing it.
Improvement: expected benefit and how it will be observed.

## Slices

- SL-001
- SL-002
- SL-003
```

## slice-card.md

```markdown
---
id: SL-001
roadmap_item: RI-001
title: Test-mode checkout creates the right entitlement
mode: 3                  # 0 | 1 | E | 2 | 3
size: L                  # XS | S | M | L | XL
work_type: integration   # ui | data | integration | ai | infra
forecast: 2-3 weeks
# defaults: change only when they differ
risk: low                # low | medium | high
ai_leverage: medium      # low | medium | high
evidence_level: F1       # F0 | F1 | F2   (F3 unavailable in the alpha)
state: ready             # ready | building | verifying | accepted
---

## Acceptance evidence (as tests where possible)

## Verification tier and reviewer

## Open decisions (question - owner - due)
```

The reference class is size + work type + mode + codebase context; set codebase context (greenfield, established, legacy) once per repository.

## evidence-record.md

```markdown
---
slice: SL-001
started: 2026-10-20
accepted: 2026-10-31
verification: specialist review; tests pass
review_wait_hours: 18
decision_latency_hours: 6
coordination_minutes: 40
people_hours: 22
ai_spend_eur: 35
rework: minor            # none | minor | major
---

## What we learned

## What would change the next forecast
```
