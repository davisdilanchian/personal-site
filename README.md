# davisdilanchian.com

Personal projects landing page for Davis Dilanchian — a running showcase of the apps, tools, and experiments he's building at any given time.

## What it is

A single static `index.html` (no build step, no framework) hosted on **GitHub Pages** at the apex domain **davisdilanchian.com**.

## Adding / editing a project

All project data lives in the `PROJECTS` array near the bottom of `index.html`. Each entry:

```js
{
  name: "Project Name",
  icon: "🚀",                 // any emoji
  status: "live",             // "live" | "beta" | "wip"
  category: "iOS",            // becomes a filter chip (iOS / Web / Tools / ...)
  desc: "One or two sentence description.",
  tags: ["Swift", "AI"],      // small mono chips
  links: [{ label: "Live", url: "https://..." }]  // [] for no links
}
```

Edit the array, commit, and push — GitHub Pages redeploys automatically.

## Hosting

- **Source:** `master` branch, root (`/`)
- **Custom domain:** `davisdilanchian.com` (set in the `CNAME` file)
- `.nojekyll` disables Jekyll processing so files serve as-is.
