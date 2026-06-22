# cafegopala-website

The public website for **Cafe Gopala, Malleshwaram** — a single static page.
Separate from the POS (that lives in the `guhya-pos` repo); this is just the
marketing site at **cafegopal.co.in**, with "Order online" buttons pointing to
the POS at **pos.cafegopal.co.in**.

## Before you publish
1. **Prices** in `index.html` are typical examples — set your real ones.
2. **Address, hours, phone** — fill the placeholders in the "Visit" section.
3. **Photos** — add your own to `assets/` (`hero.jpg`, `dosa.jpg`, `idli.jpg`,
   `coffee.jpg`). They appear automatically. Do **not** copy images from
   Zomato/Swiggy/Google — they're copyrighted.

## Deploy — pick one

### A) Free static host (simplest, no server)
Cloudflare Pages, GitHub Pages, or Netlify. Connect this repo (or drag-drop the
folder), set the custom domain to `cafegopal.co.in`, and point your DNS at the
host. HTTPS is automatic. Best choice for a marketing site.

### B) Your own server with Caddy
Copy this folder to the server, mount it at `/srv`, and use the included
`Caddyfile` (auto-HTTPS). Use this if you want the site on the same box as the
POS.

## DNS
Point `cafegopal.co.in` and `www.cafegopal.co.in` at your host/server.
(`pos.cafegopal.co.in` is the POS — configured in the guhya-pos repo.)
