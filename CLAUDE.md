# CLAUDE.md — Personal Site (davisdilanchian.com)

Guidance for Claude instances working on this project.

## What we are doing

Maintaining Davis Dilanchian's personal projects landing page — a static showcase of what he's currently building, hosted on GitHub Pages at the apex domain **davisdilanchian.com**.

## Architecture

- Single static `index.html` — no build step, no framework. Plain HTML/CSS/JS.
- All project data is in the `PROJECTS` array near the bottom of `index.html`. To add/edit a project, edit that array (see `README.md` for the schema).
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

- Edit `index.html`, commit, push to `master`. GitHub Pages redeploys automatically (~1 min).
- Keep the project list curated to **public / shippable** work. Personal/internal projects stay off the public page.

## Private: `/canvas/`

- Password-locked infinite-canvas workspace (Trello-style lists + notes; generic
  object model for future embeds/tickers). NOT linked from the public page and kept
  out of the `PROJECTS` array on purpose.
- Client-side encrypted gate (StatiCrypt-style AES-GCM): `canvas/index.html` is a
  generated loader holding only ciphertext — the plaintext app is never committed.
  Edit via `canvas/tools/decrypt.mjs` → edit → `canvas/tools/build.mjs` (needs
  `CANVAS_PASSWORD`).
- Optional cross-device sync via a Cloudflare Worker + KV (`canvas/worker/`),
  zero-knowledge (stores an opaque encrypted blob). See `canvas/README.md`.

## Completed

- Initial site built and deployed; apex domain configured.

## Next steps / future goals

- Davis to refine which projects appear and tighten descriptions.
- Possible: add screenshots/thumbnails per card, an "archive" section, dark/light toggle.
