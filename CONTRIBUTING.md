# Contributing to SLICE

Thank you for helping improve SLICE. It is in public alpha, so criticism and real-world evidence are the most valuable contributions of all.

## Ways to contribute

| Contribution | How |
| --- | --- |
| Feedback on the method: a rule that is unclear, wrong or too heavy | Open a **Specification feedback** issue |
| Results from using SLICE with a team | Open a **Pilot report** issue (see the [pilot protocol](src/content/alpha/pilot-protocol.md)) |
| Research or sources that support or contradict SLICE | Open a **Specification feedback** issue with the sources |
| Typos, broken links, website bugs | Open a **Website issue**, or send a pull request directly |
| A change to the specification | Open an issue first; send a pull request once the change is agreed |

## How decisions are made

SLICE is maintained by Milber Ferreira, who makes the final decision on every change to the specification. Accepted changes are recorded in the [decision log](src/content/decisions.md) and the [changelog](src/content/changelog.md).

Versioning follows the spec's own rule:

- **Patch** (0.3.x): corrects or clarifies without changing a rule.
- **Minor** (0.x): adds or changes rules.
- **Major** (x.0): breaks conformance.

Version 0.4 is reserved for what the public alpha teaches.

Published versions are never edited after release, apart from corrections to factual errors, which are noted in that version's status note. Changes go into the next version.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Keep each pull request to one concern. Keep specification changes separate from website code changes.
3. For specification changes, link the issue where the change was agreed.
4. Sign off every commit (see below).
5. Fill in the pull request template.

Run the website locally with `npm install` and `npm run dev`, and make sure `npm run build` passes before you open a pull request that touches code.

## Writing style for the specification

- Plain, direct sentences. One idea per sentence where possible.
- Use the terms defined in the specification's vocabulary (section 1.1); don't introduce synonyms.
- Claims need sources, or need to be labelled as hypotheses.
- No hour equivalents for sizes, no AI multipliers, no percentiles without measured history. These are rules of the framework, not style choices.

## Licence of contributions

By contributing, you agree that your contribution is licensed under the same licence as the part of the repository it changes:

- **Specification and documentation** (`src/content/`): [CC BY 4.0](src/content/LICENSE)
- **Website code** (everything else): [MIT](LICENSE)

You keep the copyright in your contribution, and you are credited for it.

## Sign-off (Developer Certificate of Origin)

Every commit must be signed off. Signing off certifies that you wrote the change, or otherwise have the right to submit it under the project's licence, as described in the [Developer Certificate of Origin 1.1](https://developercertificate.org).

Sign off by committing with `-s`:

```bash
git commit -s -m "Clarify the F2 floor"
```

This adds a line with your name and email to the commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

Pull requests with unsigned commits are flagged automatically and can't be merged until they are fixed. To sign off your last commit, run `git commit --amend -s`, then force-push your branch.

## What not to contribute

- Confidential company information, customer data or personal data, including in pilot reports. Share aggregated numbers only.
- Material you don't have the right to share, such as paywalled text copied verbatim.
- Marketing for products or services.

## Credit

Contributors are credited in [AUTHORS.md](AUTHORS.md) and in the changelog entry for the release that includes their contribution.

## Conduct

Everyone taking part in this project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
