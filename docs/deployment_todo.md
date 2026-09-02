# Cafe Gopala — Deployment TODO

> **HISTORICAL — the nginx side of this document is superseded (Sep 2026).**
> The nginx server block for `cafegopala.in` is now owned by the
> **avyangah-infra** repo: `apps/cafegopala.in.app` (rendered by `bin/render.sh`,
> deployed by `bin/deploy.sh` -> `bin/publish.sh` with validation and rollback).
> There is no nginx config in this repo any more — do not scp or hand-edit one.
> Also note the domain is `cafegopala.in`; `cafegopal.co.in` below is the old name.


A single checklist to get **cafegopal.co.in** live on the existing Hetzner
`careai-nginx` box and on auto-deploy. Detailed commands live in
`DEPLOY-cafegopala.md` and `CICD.md`; this is the running task list.

Server: `deploy@<SERVER_IP>` (Hetzner)  ·  Site dir on server:
`/home/deploy/careai/sites/cafegopal.co.in`  ·  Repo dir: `/home/deploy/careai`

---

## A. Before you publish (in this repo)
- [ ] **Add both logos** to the repo root: `logo.png` (coloured) and `logo2.png`
      (dark). Header + favicon use `logo.png`; the hero cross-fades between the two.
      Without them, images break.
- [ ] **Fill the Visit section** in `index.html` (search `EDIT`): real street
      address, hours, phone.
- [ ] **Check menu prices** — North Indian menu is live; South Indian menu is
      preserved as a hidden comment (search `SOUTH-INDIAN MENU`) to restore later.
- [ ] Confirm "Order online" points where you want: `https://pos.cafegopal.co.in/`.

## B. DNS (do first — propagation takes ~10–30 min)
- [ ] Add A record: `cafegopal.co.in` -> `<SERVER_IP>`
- [ ] Add A record: `www.cafegopal.co.in` -> `<SERVER_IP>`
- [ ] Verify: `dig +short cafegopal.co.in` shows the server IP
- [ ] (POS) Confirm `pos.cafegopal.co.in` DNS is set (handled in the guhya-pos repo)

## C. First-time server wiring (once — see DEPLOY-cafegopala.md)
- [ ] Create site dir: `ssh deploy@<SERVER_IP> 'mkdir -p /home/deploy/careai/sites/cafegopal.co.in'`
- [ ] `scp` `index.html logo.png logo2.png manifest.json robots.txt sitemap.xml` into that dir
- [ ] `scp nginx-cafegopala.conf` to `/home/deploy/careai/nginx-cafegopala.conf`
- [ ] Edit `docker-compose.yml` — add two mounts to the `nginx:` service:
      - `./nginx-cafegopala.conf:/etc/nginx/conf.d/cafegopala.conf:ro`
      - `./sites/cafegopal.co.in:/usr/share/nginx/cafegopal:ro`
- [ ] Edit `nginx.conf` — add `include /etc/nginx/conf.d/cafegopala*.conf;`
      next to the guhya include
- [ ] Create a temporary self-signed cert so nginx can boot
      (`cafegopal-privkey.pem` / `cafegopal-fullchain.pem` in `/mnt/nvme_data/ssl/`)
- [ ] `cd /home/deploy/careai && docker compose up -d` (recreates nginx; brief blip)
- [ ] `docker logs --tail=20 careai-nginx` — confirm no config errors
- [ ] Confirm `http://cafegopal.co.in` shows the site (https will warn — expected)

## D. Real TLS certificate (Let's Encrypt, once)
- [ ] Run certbot webroot for `cafegopal.co.in` + `www.cafegopal.co.in`
      (served from `/home/deploy/careai/sites/cafegopal.co.in`)
- [ ] Copy issued `fullchain.pem` / `privkey.pem` over the self-signed pair in
      `/mnt/nvme_data/ssl/` (as `cafegopal-fullchain.pem` / `cafegopal-privkey.pem`)
- [ ] `docker exec careai-nginx nginx -s reload`
- [ ] Visit `https://cafegopal.co.in` — padlock is green, site loads

## E. Auto-deploy via GitHub Actions (once — see CICD.md)
- [ ] Push this repo to GitHub (`cafegopala-website`), branch `main`
- [ ] Confirm `logo.png` is committed (not git-ignored)
- [ ] Add repo secrets (same values as care-ai / guhya-website):
      `UK_SERVER_IP`, `SSH_USER` (=`deploy`), `SSH_PRIVATE_KEY`
- [ ] Trigger a deploy: push to `main`, or Actions -> "Deploy Cafe Gopala Website"
      -> Run workflow
- [ ] Confirm the run is green and the live site updated

## F. Final checks
- [ ] Mobile view looks right (menu stacks, logo crisp)
- [ ] "Order online" opens `pos.cafegopal.co.in`
- [ ] Address/hours/phone are correct in the live site
- [ ] `robots.txt` + `sitemap.xml` reachable at the domain root
- [ ] (optional) Submit `https://cafegopal.co.in/sitemap.xml` in Google Search Console

## G. Cert renewal reminder (every ~60–90 days)
- [ ] After `certbot renew`, re-copy the two cert files and
      `docker exec careai-nginx nginx -s reload` — or wire a `--deploy-hook`
      so it's automatic.

---

### Updating the site after go-live
Edit any file -> `git push` to `main` -> Actions copies files + reloads nginx
in ~30 seconds. It never touches Care AI, SignSimple, Guhya, or the POS.
