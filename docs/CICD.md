# Auto-deploy (GitHub Actions -> Hetzner)

Every push to `main` copies the site to the server and reloads nginx — the same
pattern care-ai and guhya-website use, with no Docker build (the site is static).

## First-time setup (~10 minutes, once)

### 1. Make sure the server side is ready (one time)
Follow `DEPLOY-cafegopala.md` once so that on the server:
- `/home/deploy/careai/sites/cafegopal.co.in/` exists
- the nginx block for the site is live and a TLS cert is in place
  (owned by avyangah-infra: `apps/cafegopala.in.app`, deployed with `bin/deploy.sh`)
- `cafegopal.co.in` DNS points at the server

### 2. Put this folder on GitHub
From inside `cafegopala-website/`:

    git add .
    git commit -m "Cafe Gopala website: new logo-led design + deploy config"
    git branch -M main
    # create an empty repo named cafegopala-website on github.com first, then:
    git remote add origin git@github.com:pravreddy/cafegopala-website.git
    git push -u origin main

> Make sure `logo.png` is in the folder before committing, so it deploys too.

### 3. Add the three secrets to the new repo
GitHub -> the `cafegopala-website` repo -> **Settings -> Secrets and variables
-> Actions -> New repository secret**. Use the SAME values as care-ai / guhya:

| Secret name        | Value                              |
|--------------------|------------------------------------|
| `UK_SERVER_IP`     | your Hetzner server IP             |
| `SSH_USER`         | `deploy`                           |
| `SSH_PRIVATE_KEY`  | the same private key care-ai uses  |

## After setup
- Edit any file -> `git push` -> the site updates on the server in ~30 seconds.
- Or trigger manually: repo -> **Actions -> Deploy Cafe Gopala Website -> Run workflow**.

## What the workflow does
See `.github/workflows/deploy.yml`:
1. `scp` `index.html, logo.png, manifest.json, robots.txt, sitemap.xml` into
   `/home/deploy/careai/sites/cafegopal.co.in/`
2. `docker exec careai-nginx nginx -t` then `nginx -s reload`

It never touches Care AI, SignSimple, Guhya, or the POS — it only writes the
Cafe Gopala site folder and reloads the shared nginx.
