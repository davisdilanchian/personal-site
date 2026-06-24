# Canvas — private infinite-canvas workspace

A password-locked infinite canvas at **davisdilanchian.com/canvas/**. Drag objects
around an endless pannable/zoomable space. v1 ships Trello-style **lists** (cards you
can add / check / edit / delete / reorder / drag between lists) and **notes**. The
object model is generic, so images, HTML embeds, and stock tickers can be added later
as new object `type`s + renderers.

It's a single static page — no build step for the site itself, consistent with the
rest of the repo.

## How the security works

This site is served straight from GitHub Pages on a public repo, so there's no server
to check a password. Instead:

1. **Encrypted gate.** `index.html` is a tiny loader that contains *only* the
   AES‑256‑GCM ciphertext of the app, sealed with a key derived from your password
   (PBKDF2‑SHA256, 200k iterations). Without the password the page literally cannot
   render — the plaintext app is never committed.
2. **Encrypted data at rest.** Your board is encrypted in the browser with the same
   password before it's stored, so neither `localStorage` nor the cloud ever see
   plaintext (zero‑knowledge). The PBKDF2 salt travels inside the saved blob so any
   device can derive the same key from the password.

> Honest caveat: this is strong *for a personal tool*, but it's still a client-side
> scheme on a public host. Use a strong password — a weak one is brute-forceable
> offline. Don't store anything you'd be harmed by leaking.

## Cross-device sync (Cloudflare Worker + KV)

By default the board lives in this browser's `localStorage`. To make it follow you
across browsers/devices, deploy the included Worker (one-time, ~5 min) and connect it.

The Worker stores a single opaque encrypted blob in KV and authorizes requests with
`Authorization: Bearer sha256(password)`. It never sees your board contents.

### Deploy

```bash
cd canvas/worker
npm i -g wrangler         # if you don't have it
wrangler login

# 1) create the KV namespace, then paste the printed id into wrangler.toml
wrangler kv namespace create CANVAS_KV

# 2) set the password (MUST match the page password)
wrangler secret put CANVAS_PASSWORD

# 3) ship it
wrangler deploy
```

`wrangler deploy` prints a URL like `https://canvas-sync.<your-subdomain>.workers.dev`.
In the app, click **⌁ Local only** in the bottom toolbar and paste that URL. The
button flips to **☁︎ Synced**. Repeat the "paste URL" step once on each device.

CORS in `worker.js` allows `https://davisdilanchian.com` (plus localhost for testing).
Edit `ALLOW_ORIGIN` if the domain changes.

## Changing the password

The password is baked into the encrypted loader, so changing it = rebuild:

```bash
# recover the current app source (needs the current password)
CANVAS_PASSWORD='current-pw' node canvas/tools/decrypt.mjs canvas/index.html /tmp/app.html

# re-encrypt with the new password
CANVAS_PASSWORD='new-pw' node canvas/tools/build.mjs /tmp/app.html canvas/index.html

rm /tmp/app.html        # don't commit plaintext
git add canvas/index.html && git commit -m "canvas: rotate password" && git push
```

Then update the Worker secret to match: `wrangler secret put CANVAS_PASSWORD`.

⚠️ Changing the password does **not** re-encrypt existing board data. If you've
already saved a board, rotate the password *before* putting real data in, or you'll
have to reset the board (the app offers a "Start fresh" button when it can't decrypt).

## Editing the app

`canvas/index.html` is generated; the real source is the plaintext you get from
`decrypt.mjs`. Workflow: `decrypt → edit → build → commit`. Keep the plaintext out of
the repo.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Encrypted loader + app payload (the only thing the browser loads) |
| `tools/build.mjs` | Encrypt a plaintext app file into `index.html` |
| `tools/decrypt.mjs` | Recover the plaintext app from `index.html` |
| `worker/worker.js` | Cloudflare Worker sync backend (zero-knowledge KV store) |
| `worker/wrangler.toml` | Worker + KV binding config |
