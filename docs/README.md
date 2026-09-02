# cafegopala-website

The public website for **Cafe Gopala, Malleshwaram** — a single static page at
**cafegopal.co.in**, with "Order online" buttons pointing to the POS at
**pos.cafegopal.co.in** (the POS lives in the `guhya-pos` repo).

Warm, devotional design built around the Cafe Gopala logo (Gopala Krishna with
the flute and cow). Saffron / marigold gold / deep maroon palette, Cormorant +
Mukta type, with a temple-arch and marigold-garland motif.

## Files
- `pages/` — the site HTML (`index.html`, `order.html`, `reserve.html`,
  `story.html`, `reviews.html`, `404.html`). Deployed FLAT to the site root by
  `.github/workflows/deploy.yml` (`strip_components: 1`), so live URLs are
  `/`, `/order.html`, ... — there is no `/pages/` prefix on the live site.
- `images/`, `videos/` — assets, referenced from pages as `../images/...`
- `docs/` — documentation and archive (never deployed)
- `data/reviews.json` — NOT in this repo. The live Google rating and reviews are
  written nightly into the site directory on the server by the `cafegopala-reviews`
  cron job in the **avyangah-infra** repo (`jobs/cafegopala-reviews/`). Do not add
  `data/` back to the deploy upload list — it would overwrite the live file.
- `tests/` — Playwright video/QA tooling (never deployed)
- `images/logo.png` — the brand logo, used by the hero + header + favicon
- `manifest.json`, `robots.txt`, `sitemap.xml` — PWA + SEO
- nginx server block — NOT in this repo; owned by avyangah-infra
  (`apps/cafegopala.in.app`)
- `.github/workflows/deploy.yml` — auto-deploy on push to `main`
- `docs/DEPLOY-cafegopala.md` — one-time server wiring (historical)
- `docs/CICD.md` — GitHub Actions setup

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
