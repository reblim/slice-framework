<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Docs content is markdown under src/content, loaded eagerly via import.meta.glob in src/lib/content.ts; versions come from src/content/versions.json — keeps the site static with no backend.
- Site name lives only in src/config.ts (SITE_NAME) so the framework can be renamed in one place.
- Research index discovery uses the shared eager markdown registry, and document routes reject missing sources with shared page-status boundaries so navigation stays static and missing documents show 404s.
- Calculator domain rules live in a browser-safe pure module and CSV parsing uses Papa Parse; keeping calculations separate from controls makes evidence and flow rules independently testable without a backend.
- Calculator input adapters serialize editable history through the existing parser; label help is centralized separately from controls to preserve exact explanations and existing evidence rules.
- DocumentationShell owns shared navigation, version selection and scroll-spy ToC around the root Outlet; leaf routes retain document loading and metadata so layout changes never change public URLs or content sources.
