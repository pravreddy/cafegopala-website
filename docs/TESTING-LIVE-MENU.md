# Live menu — how to test BEFORE the website deploys (until Aug 13)

The website is not deployed yet — that does NOT block testing. CORS only
restricts browsers, and the browser part can run from localhost. Three layers,
in order:

## 0. One-time setup (backend)

```bash
cd ~/Projects/github/guhya-pos
python manage.py migrate            # adds the 3 menu-share fields to Tenant
python manage.py test api.test_public_menu   # 18 tests, all should pass
```

Then enable sharing for Cafe Gopala — either in Django admin (Tenancy →
Tenants → Cafe Gopala), or via the API as the owner:

```bash
# as the owner (with your auth token):
curl -X PATCH https://pos.cafegopal.co.in/api/tenant/ \
  -H "Authorization: Token <owner-token>" -H "Content-Type: application/json" \
  -d '{"menu_share_enabled": true,
       "menu_share_origins": "https://cafegopal.co.in, https://www.cafegopal.co.in, http://localhost:8080"}'
# the response now contains the auto-generated menu_share_key — copy it
```

(To rotate the key later: `POST /api/tenant/menu-share-key/` — old key dies
instantly.)

## 1. Test with curl (no website at all)

```bash
# happy path — should return the live menu JSON:
curl -H "X-Share-Key: <the-key>" \
  https://pos.cafegopal.co.in/api/public/cafe-gopala/menu/

# wrong key → 403 · wrong slug → 404 · sharing toggled off → 403
# ETag check — second call should be an empty 304:
curl -i -H "X-Share-Key: <the-key>" \
  https://pos.cafegopal.co.in/api/public/cafe-gopala/menu/     # note the ETag
curl -i -H "X-Share-Key: <the-key>" -H 'If-None-Match: "<etag>"' \
  https://pos.cafegopal.co.in/api/public/cafe-gopala/menu/     # → 304
```

Live-update check: 86 an item on the cashier's menu board, re-run the first
curl — the item should be gone from the JSON within seconds.

## 2. Test the real page from localhost (full browser integration)

```bash
cd ~/Projects/github/cafegopala-website
# 1. paste the share key into index.html (search PASTE_SHARE_KEY_HERE)
# 2. make sure http://localhost:8080 is in menu_share_origins (step 0 above)
python3 -m http.server 8080
# open http://localhost:8080 — the menu cards should swap to the LIVE menu
```

What to verify in the browser dev tools (Network tab):
- an OPTIONS preflight then a GET to `/api/public/cafe-gopala/menu/`, both OK
- edit a price in the POS, reload → new price appears
- stop the POS (or set a wrong key temporarily) → page still shows the
  hardcoded static menu — never blank

## 3. On deploy day (Aug 13)

- remove `http://localhost:8080` from menu_share_origins
- confirm the real key is pasted in the deployed index.html
- push to main → GitHub Actions deploys → open cafegopal.co.in and repeat the
  browser checks

## Note on prices

The live menu REPLACES the hardcoded cards, so POS prices win in any browser.
The hardcoded cards remain the fallback + what search engines index — keep
them roughly in sync now and then (or regenerate them from the API later).
