# davisdilanchian.com

Personal projects site for Davis Dilanchian: the apps, tools and experiments he is building.

Static HTML and CSS, no build step, hosted on **GitHub Pages** at **davisdilanchian.com**
(served from `master`; pushing redeploys in about a minute).

## Layout

```
index.html                home page: intro, social links, one card per project
<slug>/index.html         project page: icon, status, links, About, Built with, follow-on-X box
<slug>/privacy.html       privacy policy (App Store apps: mugula, pareto, 8mb, staffwise)
<slug>/support.html       support page   (mugula, pareto, staffwise)
assets/site.css           the one stylesheet for every page (light and dark mode)
assets/thumbs/<slug>.webp 256 px project icons used on every page
assets/icons/             full-size source icons the thumbnails are made from
sitemap.xml, robots.txt   search-engine files; add new pages to sitemap.xml
```

`keywise/` holds the privacy and support pages from before Keywise was renamed Staffwise.
They are kept in case those URLs were submitted to Apple; they are not linked or in the sitemap.

## Adding or editing a project

1. **Home card:** copy an `<article class="card">` block in `index.html` and change the
   link, icon, status pill (`live`, `beta` or `wip`), platform, description and buttons.
2. **Project page:** copy an existing `<slug>/index.html` (e.g. `groupier/`) into a new folder
   and edit the head tags, hero, buttons, About text and Built with list.
3. **Icon:** put the full-size icon in `assets/icons/` and save a 256 x 256 WebP of it as
   `assets/thumbs/<slug>.webp`.
4. Add the page to `sitemap.xml`.

House style: no em dashes in page copy.
