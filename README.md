# SLICE Framework

SAFETY: New project. Build only what is listed. No backend, no auth, no Supabase.

GOAL: Documentation site for an open framework. Working name "SLICE": keep it in one constant (SITE_NAME in src/config.ts) so it can be renamed later.

FILES TO CREATE:

- src/config.ts: SITE_NAME = "SLICE", TAGLINE = "Decide deliberately. Build small. Count only what is proven."

- src/content/versions.json:

  [{"id":"0.3.1","label":"v0.3.1 · Public alpha","status":"current"},

   {"id":"0.3","label":"v0.3","status":"archived"},

   {"id":"0.2","label":"v0.2","status":"archived"},

   {"id":"0.1","label":"v0.1","status":"archived"}]

- src/content/spec/0.3.1.md, 0.3.md, 0.2.md, 0.1.md, each containing "# Placeholder"

- src/lib/content.ts: load all markdown with

  import.meta.glob('/src/content/**/*.md', { query: '?raw', import: 'default', eager: true })

ROUTES: / , /spec/:version , /alpha/:page , /changelog , /decisions , /research/:page

/spec redirects to the current version from versions.json.

RENDERING: react-markdown + remark-gfm (tables, task lists) + rehype-slug.

Spec page: left sidebar = table of contents from h2/h3; top bar = version dropdown from versions.json.

Archived versions show a banner: "Archived version" + link to the current version.

Code blocks: monospace, horizontal scroll, copy button.

Under 768px the sidebar becomes a drawer.

DESIGN: calm, text-first, max line width 72ch, system fonts, light and dark mode.

DO NOT: add a CMS, database, login, analytics or marketing placeholder copy.

VERIFY: build passes; /spec/0.1 to /spec/0.3.1 all render; dropdown switches versions;

banner shows on 0.3, 0.2 and 0.1 only.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/42fef9b5-246d-4651-82ae-214d1460a9ed).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
