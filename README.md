# cafegopala-website

The public website for **Cafe Gopala, Malleshwaram** — a single static page at
**cafegopal.co.in**, with "Order online" buttons pointing to the POS at
**pos.cafegopal.co.in** (the POS lives in the `guhya-pos` repo).

Warm, devotional design built around the Cafe Gopala logo (Gopala Krishna with
the flute and cow). Saffron / marigold gold / deep maroon palette, Cormorant +
Mukta type, with a temple-arch and marigold-garland motif.

## Files
- `index.html` — the site (self-contained except for `logo.png`)
- `logo.png` — the brand logo, used by the hero + header + favicon **(keep this file here)**
- `manifest.json`, `robots.txt`, `sitemap.xml` — PWA + SEO
- `nginx-cafegopala.conf` — server block for cafegopal.co.in
- `.github/workflows/deploy.yml` — auto-deploy on push to `main`
- `DEPLOY-cafegopala.md` — one-time server wiring
- `CICD.md` — GitHub Actions setup

## Before you publish
1. **Address, hours, phone** — fill the placeholders in the "Visit" section of `index.html` (search `EDIT`).
2. **Prices** — the menu shows your current prices; update anytime.
3. **logo.png** — make sure it's in this folder (it already renders the hero + header).

## Deploy
Same pattern as `guhya-website`: it rides on the existing Hetzner `careai-nginx`
container. Do the one-time wiring in **DEPLOY-cafegopala.md**, then set up
GitHub Actions per **CICD.md** — after that, every `git push` to `main`
publishes automatically in ~30 seconds.

## DNS
Point `cafegopal.co.in` and `www.cafegopal.co.in` at the Hetzner server.
(`pos.cafegopal.co.in` is the POS — configured in the guhya-pos repo.)
