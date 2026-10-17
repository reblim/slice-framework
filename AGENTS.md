# Agent notes

## Git
- `main` is synced with the visual editor. Never force-push, rebase, amend or squash commits that are already on `main`; add new commits instead.
- Keep `main` buildable: run `bun run lint`, `bun run test` and `bun run build` before pushing.

## Architecture

- Docs content is markdown under src/content, loaded eagerly via import.meta.glob in src/lib/content.ts; versions come from src/content/versions.json — keeps the site static with no backend.
- Site name lives only in src/config.ts (SITE_NAME) so the framework can be renamed in one place.
- Research index discovery uses the shared eager markdown registry, and document routes reject missing sources with shared page-status boundaries so navigation stays static and missing documents show 404s.
- Calculator domain rules live in a browser-safe pure module and CSV parsing uses Papa Parse; keeping calculations separate from controls makes evidence and flow rules independently testable without a backend.
- Calculator input adapters serialize editable history through the existing parser; label help is centralized separately from controls to preserve exact explanations and existing evidence rules.
- DocumentationShell owns shared navigation, version selection and scroll-spy ToC around the root Outlet; leaf routes retain document loading and metadata so layout changes never change public URLs or content sources.
- The calculator has two tabs: "Quick estimate" (pure rules in src/lib/quick-estimate.ts, ranges overridable via localStorage) and "Full SLICE forecast" (src/lib/calculator.ts); "Continue in Full SLICE forecast" carries answers into the full tab as F1 scenarios, and the quick tab never duplicates full-tab rules.
- Calculator results are derived only from useMemo over inputs (no state-from-state effects) so the page stays idle-safe; per-step "touched" tracking gates every warning and result behind user interaction.
