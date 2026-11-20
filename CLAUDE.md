# CLAUDE.md — Personal Site (davisdilanchian.com)

Guidance for Claude instances working on this project.

## What we are doing

Maintaining Davis Dilanchian's personal projects landing page — a static showcase of what he's currently building, hosted on GitHub Pages at the apex domain **davisdilanchian.com**.

## Architecture

- Static HTML/CSS/JS, no build step, no framework. One stylesheet: `assets/dossier.css`.
- The design is a **declassified CIA dossier** (stamps, redaction bars, codenames, halftone exhibit photos). This is the site's charm: keep it. Do not replace it with a plain or "modern" layout.
- All home-page project data is in the `PROJECTS` array near the bottom of `index.html`; each project also has a case file at `<slug>/index.html`. See `README.md` for the schema.
- House style: no em dashes in page copy.
- `CNAME` → `davisdilanchian.com` (apex domain). `.nojekyll` disables Jekyll.

## Hosting

- **Repo:** `https://github.com/davisdilanchian/personal-site` (public — required for free GitHub Pages with custom domain).
- **GitHub Pages source:** `master` branch, root path `/`.
- This mirrors the Dandle setup (apex custom domain via CNAME file, served from master).

## DNS (Namecheap)

Apex domain points at GitHub Pages via these records:
- 4× `A` @ → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- 4× `AAAA` @ → `2606:50c0:8000::153`, `:8001::153`, `:8002::153`, `:8003::153`
- 1× `CNAME` www → `davisdilanchian.github.io.`

## Workflow

- Edit the pages, commit, push to `master`. GitHub Pages redeploys automatically (~1 min).
- Keep the project list curated to **public / shippable** work. Personal/internal projects stay off the public page.

## Completed

- Initial site built and deployed; apex domain configured.

## Next steps / future goals

- Davis to refine which projects appear and tighten descriptions.
- Possible: add screenshots/thumbnails per card, an "archive" section, dark/light toggle.
