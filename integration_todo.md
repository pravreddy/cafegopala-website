# Cafe Gopala website — FastPOS integration TODO (website side)

⚠ **The source of truth for all backend design is `guhya-pos/TODO.md`** —
see "PUBLIC CUSTOMER SURFACE" (2026-07-28), "MANUAL-VERIFIED UPI PREPAY"
(2026-07-31) and "CAFE GOPALA ↔ FASTPOS — SESSION UPDATE" (2026-08-07).
This file is ONLY the website-repo checklist. Deployment/hosting tasks stay in
`deployment_todo.md`.

Key fact: Cafe Gopala has **no CRM or database of its own** — FastPOS holds the
menu, orders, reservations and customers. This site is a thin public front-end
over `https://pos.cafegopal.co.in/api/public/<slug>/...` (unauthenticated,
read-only where possible, CORS-locked to this domain, rate-limited). No API
keys or logins ever go in this site's JavaScript.

---

## 1. Live menu from FastPOS
- [ ] Keep the hardcoded menu in HTML as the fallback (SEO + works with JS off)
- [ ] Small script fetches `GET /api/public/<slug>/menu/` with the
      `X-Share-Key` header and swaps the live menu in; on any failure the
      static copy stays — menu never renders blank
- [ ] The share key comes from POS Settings → "Share menu with your website"
      (generate there, paste here). It is a PUBLISHABLE key — an identity +
      kill switch bound to this domain, not a secret; the owner can turn
      sharing off or regenerate the key any time and this site stops working
      until the new key is pasted in
- [ ] Occasionally regenerate the static fallback from the API so prices don't
      drift from the POS

## 2. Reservations page (`/reserve/`)
- [ ] Progressive form: date → available slots (fetched) → party size → phone
- [ ] Non-JS fallback: show the phone number prominently
- [ ] Confirmation screen with cancel link (magic link, no login)
- [ ] Add `acceptsReservations` to the JSON-LD once live

## 3. Delivery links + order-online-and-pickup
- [ ] Delivery section: **Zomato / Swiggy / Rapido buttons only** (no
      integration build) + "or skip the fees — order ahead and pick up" CTA
- [ ] `/order/` page: cart from live menu → pickup slot (**up to 7 days
      ahead**) → phone → UPI pay screen (QR + `upi://pay` intent link with
      amount + order ref) → "I've paid" + screenshot or UTR → status page
      (magic link) showing awaiting-confirmation → confirmed → preparing →
      ready. Cashier confirms the money in the POS before handover — that
      flow is all backend (see guhya-pos TODO)
- [ ] ⚠ Before any prepay goes live the site needs **refund/cancellation
      policy, T&Cs, privacy policy and contact pages** (also required later
      for gateway onboarding — always discovered late)

## 4. Ekadashi banner + pre-booking
- [ ] Banner appears automatically when FastPOS says a **confirmed** Ekadashi
      is upcoming (owner confirms via email link — backend job):
      "Ekadashi on <date> — pre-book your prasadam"
- [ ] Pre-booking = the `/order/` flow filtered to the Ekadashi menu,
      future-dated to the Ekadashi date; cut-off the evening before
- [ ] If the owner hasn't confirmed: nothing shows. Silent-off, never a wrong
      menu

## Blockers / decisions (owner input needed)
- [ ] Real street address, hours, phone — still `[EDIT]` in `index.html`;
      blocks JSON-LD, reservation confirmations and pickup "where to collect"
- [ ] Cafe's UPI VPA for the pay screen QR / intent link
- [ ] Zomato / Swiggy / Rapido restaurant page URLs
- [ ] Owner email address for the Ekadashi confirm mail
- [ ] Ekadashi calendar source: ISKCON Bangalore (recommended — their dates
      can differ from the GBC calendar), loaded by hand yearly into FastPOS

## Do-not
- Do NOT delete any images in this repo (logo.png / logo2.png / jpeg variants
  are all in use or kept deliberately)
- Do NOT put any secret, key or login in front-end code — if something needs
  auth it belongs in guhya-pos, behind the public API
