# Deploy cafegopal.co.in on the existing Hetzner server

> **HISTORICAL — the nginx side of this document is superseded (Sep 2026).**
> The nginx server block for `cafegopala.in` is now owned by the
> **avyangah-infra** repo: `apps/cafegopala.in.app` (rendered by `bin/render.sh`,
> deployed by `bin/deploy.sh` -> `bin/publish.sh` with validation and rollback).
> There is no nginx config in this repo any more — do not scp or hand-edit one.
> Also note the domain is `cafegopala.in`; `cafegopal.co.in` below is the old name.


Adds the Cafe Gopala static site next to Care AI + SignSimple + Guhya, behind
the same `careai-nginx` container. Additive only — does not change the other
sites. The POS at `pos.cafegopal.co.in` is served separately by the guhya-pos
stack and is not touched here.

Server: `deploy@<SERVER_IP>`  ·  Repo dir on server: `/home/deploy/careai`
Site dir on server: `/home/deploy/careai/sites/cafegopal.co.in`

---

## 0. DNS (do this first, then wait ~10–30 min)
At your registrar for `cafegopal.co.in`, add:

    A   cafegopal.co.in       -> <SERVER_IP>
    A   www.cafegopal.co.in   -> <SERVER_IP>

Check:  `dig +short cafegopal.co.in`  -> should show your server IP.
(`pos.cafegopal.co.in` is the POS — its own DNS record, configured elsewhere.)

---

## 1. Upload the site (run from your Mac, from inside this folder)

    ssh deploy@<SERVER_IP> 'mkdir -p /home/deploy/careai/sites/cafegopal.co.in'
    scp index.html          deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
    scp logo.png            deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
    scp manifest.json       deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
    scp robots.txt          deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
    scp sitemap.xml         deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
    scp nginx-cafegopala.conf deploy@<SERVER_IP>:/home/deploy/careai/nginx-cafegopala.conf

> After first-time setup, GitHub Actions does this for you on every push
> (see CICD.md). This section is only for the initial wiring.

---

## 2. Wire it into nginx — two small edits on the server

### a) docker-compose.yml -> add two lines to the `nginx:` service `volumes:`

      volumes:
        # ...existing mounts...
        - ./nginx-cafegopala.conf:/etc/nginx/conf.d/cafegopala.conf:ro      # <-- add
        - ./sites/cafegopal.co.in:/usr/share/nginx/cafegopal:ro             # <-- add

### b) nginx.conf -> add one include line, next to the guhya include

        include /etc/nginx/conf.d/guhya*.conf;
        include /etc/nginx/conf.d/cafegopala*.conf;                         # <-- add

---

## 3. Temporary self-signed cert (so nginx can boot before the real cert exists)

    sudo openssl req -x509 -nodes -newkey rsa:2048 -days 2 \
      -keyout /mnt/nvme_data/ssl/cafegopal-privkey.pem \
      -out    /mnt/nvme_data/ssl/cafegopal-fullchain.pem \
      -subj "/CN=cafegopal.co.in"

---

## 4. Recreate nginx with the new mounts

    cd /home/deploy/careai
    docker compose up -d
    docker logs --tail=20 careai-nginx     # confirm: no config errors

Now http://cafegopal.co.in shows the site (redirects to https, which warns
about the self-signed cert — expected, fixed next).

---

## 5. Real Let's Encrypt cert (webroot served by the running nginx)

    docker run --rm \
      -v /home/deploy/careai/sites/cafegopal.co.in:/webroot \
      -v /etc/letsencrypt:/etc/letsencrypt \
      certbot/certbot certonly --webroot -w /webroot \
      -d cafegopal.co.in -d www.cafegopal.co.in \
      --email YOUR_EMAIL@example.com --agree-tos --no-eff-email

Copy the issued cert over the self-signed one and reload:

    sudo cp /etc/letsencrypt/live/cafegopal.co.in/fullchain.pem /mnt/nvme_data/ssl/cafegopal-fullchain.pem
    sudo cp /etc/letsencrypt/live/cafegopal.co.in/privkey.pem  /mnt/nvme_data/ssl/cafegopal-privkey.pem
    docker exec careai-nginx nginx -s reload

Visit https://cafegopal.co.in — done.

---

## 6. Renewal (every ~60–90 days)
After `certbot renew`, re-copy the two files and reload nginx (or add a
`--deploy-hook` so it happens automatically):

    sudo cp /etc/letsencrypt/live/cafegopal.co.in/fullchain.pem /mnt/nvme_data/ssl/cafegopal-fullchain.pem
    sudo cp /etc/letsencrypt/live/cafegopal.co.in/privkey.pem  /mnt/nvme_data/ssl/cafegopal-privkey.pem
    docker exec careai-nginx nginx -s reload

---

## Updating the site later
Once CICD is set up (CICD.md), just `git push` — GitHub Actions copies the
files and reloads nginx in ~30 seconds. Or manually:

    scp index.html deploy@<SERVER_IP>:/home/deploy/careai/sites/cafegopal.co.in/
