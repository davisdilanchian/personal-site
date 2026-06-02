# davisdilanchian.com

Personal projects landing page for Davis Dilanchian — a running showcase of the apps, tools, and experiments he's building at any given time.

## What it is

A single static `index.html` (no build step, no framework) hosted on **GitHub Pages** at the apex domain **davisdilanchian.com**.

The design is a **declassified CIA dossier**: aged-photocopy paper, typewriter type
(Special Elite + Courier Prime), classification banners, rubber stamps, and black
redaction bars you can hover to "declassify." Each project is rendered as a numbered
case file with a halftone "exhibit" photo of its real app icon.

## Adding / editing a project

All project data lives in the `PROJECTS` array near the bottom of `index.html`. Each entry:

```js
{
  name: "Project Name",
  icon: "assets/icons/doc/name.png",  // halftone exhibit photo (see "Assets")
  status: "live",                     // "live" | "beta" | "wip"
  category: "iOS",                    // filter tab (iOS / Web / Tools / ...)
  codename: "BLUE BUBBLE",            // shown as CODENAME in the file header
  summary: "What it does. Wrap ||a phrase|| in double pipes to redact it.",
  caps: ["Swift", "AI"],              // "KNOWN CAPABILITIES" list
  dispo: [{ label: "site.com", url: "https://..." }]  // [] = "deployment pending"
}
```

`||double pipes||` become hover-to-reveal redaction bars. Edit the array, commit, and
push — GitHub Pages redeploys automatically.

## Assets

- `assets/icons/` — full-color source icons pulled from each project; `assets/icons/doc/`
  — the halftone "evidence photo" versions actually shown on the page.
  Regenerate a doc icon: `magick src.png -background white -flatten -resize 240x240 -colorspace Gray -brightness-contrast 6x35 -ordered-dither o4x4 doc/name.png`
- `assets/figures/` — grayscale esoteric diagrams used as "exhibits."
- `assets/paper-noise.png`, `assets/speckle.png` — photocopy paper texture.

Contact channels live in the `SOCIALS` array (`@davisdilanchian` everywhere; GitHub is `davisdilanchian`).

## Hosting

- **Source:** `master` branch, root (`/`)
- **Custom domain:** `davisdilanchian.com` (set in the `CNAME` file)
- `.nojekyll` disables Jekyll processing so files serve as-is.
