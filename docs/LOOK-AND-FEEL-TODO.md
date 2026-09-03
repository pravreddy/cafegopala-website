# Cafe Gopala — Look & Feel Redesign TODO

**Created:** 2026-08-08  
**Status:** Planning only — no code changes yet  
**Goal:** Make the site more attractive, devotional, and true to **Cafe Gopala** — a **fully saatvik** cafe (dine-in, takeaway, and order online) rooted in **Srila Prabhupada’s teachings** — without bloating the homepage or blocking on the new address.

**How we work:** One task at a time → plan → implement → review → redo if needed. No deadline.

---

## Decisions locked in (2026-08-08)

| Question | Answer | Implication for copy & design |
|----------|--------|-------------------------------|
| Onion & garlic? | **Yes — 100% of menu items** exclude onion and garlic | State boldly on homepage: *“Every dish — no onion, no garlic.”* Not “most items.” |
| Mushroom? | **Yes — 100% excluded** | Include in trust badge: *“No mushroom”* — tamasic in Vaishnava / saatvik tradition |
| Who speaks on About? | **Cafe Gopala** (the cafe), not a personal owner name | Voice = “we” as Cafe Gopala. Warm, not corporate. |
| Cafe vs kitchen? | **Cafe Gopala** — dine-in **and** takeaway (plus order online) | Say *cafe*, not “home kitchen only.” Homemade **spirit**, public **cafe**. |

---

## What the site says today (baseline)

| Section | What it does now | Issue |
|---------|------------------|-------|
| **Hero** | Logo cross-fade, tagline, generic “North Indian vegetarian” lede | Doesn’t mention **saatvik** or the spiritual purpose |
| **Strip** (3 columns) | “Chaat & snacks / Mains / Chai” blurbs | **Redundant** with the menu below — prime candidate to **remove or replace** |
| **Menu** | Curated teaser (~6 categories) + link to `order.html` | Fine as a shop window; intro line only says “pure vegetarian” |
| **Verse** | One static line: *Annam Brahma* | Good seed — could expand into **Prabhupada quotes scroller** |
| **Visit** | Address placeholders, Zomato/Swiggy/Rapido, order card | **Blocked** — moving out of Malleshwaram; generic partner URLs |
| **Nav** | Menu · Visit · Order | Missing **About** and **Saatvik** story |

**Video assets in repo (not on site yet):**

| File | Size | Suggested use |
|------|------|---------------|
| `cafe_gopala_animated_logo_clean.webm` + `.mp4` | 1.3 MB / 3.2 MB | Hero accent or `/gallery` feature — use **webm first**, mp4 fallback |
| `Love_it_thanks_I_want_ot_use_i.mp4` | 2.5 MB | Review content — likely a design iteration export; **watch before publishing** |
| `No_Please_use_teh_same_imge_wa.mp4` | 2.5 MB | Same — confirm whether these two are customer-facing or dev-only |

---

## Design direction (agreed themes)

1. **Saatvik first** — the whole menu is saatvik; explain what that means in plain, welcoming language (not preachy).
2. **About us** — **Cafe Gopala**’s story: saatvik food with a homemade heart, following Srila Prabhupada’s teachings; began for family and friends, now a cafe welcoming dine-in, takeaway, and online orders.
3. **Prabhupada quotes** — gentle horizontal scroller (marquee or slow auto-scroll), devotional tone matching the saffron/maroon palette.
4. **Videos** — keep homepage light; optional **`gallery.html`** (or “Our story”) for people who want to watch.
5. **Simpler, sharper homepage** — remove clutter; every section should earn its place.
6. **Address & delivery URLs** — **defer** until the new location is final (see Deferred section).

**Tone guide:** Warm, homely, respectful. A guest who doesn’t know ISKCON should feel welcome; someone who does should feel “this is our kind of cafe.” Avoid jargon without explanation (define *saatvik*, *prasadam*, *Krishna*’s grace once, then use naturally). Always **Cafe Gopala**, never “the kitchen” as the main identity.

---

## Proposed homepage flow (after redesign)

```
[Header]  Logo · Menu · Saatvik · About · Visit · Order online

[Hero]    Animated logo (optional subtle video) + tagline + one saatvik-forward lede

[Saatvik] What saatvik means · what we never use · why it matters · green ✓ badge

[About]   Cafe Gopala story · Prabhupada’s teachings · family & friends · dine-in + takeaway

[Quotes]  Srila Prabhupada quote scroller (auto, pausable, reduced-motion safe)

[Menu]    Teaser cards (unchanged behaviour — live POS + static fallback)

[Visit]   Simplified — order & collect prominent; address TBD banner

[Footer]  Logo · © · Order link · optional Gallery link
```

**Remove or shrink (candidates — confirm when implementing):**

- [ ] **Strip section** (Chaat / Mains / Chai three-column band) — content duplicated by menu
- [ ] **Delivery partner links** on homepage until real URLs exist — replace with one line: *“Delivery via partners — details coming soon”*
- [ ] **Verbose order-options card** — keep “Order & collect”; shorten delivery + reserve copy
- [ ] **Footer “Malleshwaram”** — use neutral “Bengaluru” or “New location coming soon” until move is done

**Keep:**

- Hero logo cross-fade (or evolve to animated video — see Task 4)
- Temple arch + marigold garland motif
- Saffron / gold / maroon palette + Cormorant + Mukta fonts
- Live menu script + static fallback
- `order.html` flow (separate from this redesign pass)

---

## Task list (one at a time)

### Phase A — Content & copy (you + me, no heavy code)

#### A1. Saatvik section — copy draft
- [ ] Write **headline** (e.g. “Fully saatvik — every dish, every day”)
- [ ] Write **3–4 short bullets** explaining saatvik for Cafe Gopala:
  - Pure vegetarian — no meat, fish, eggs
  - **No onion, no garlic, no mushroom — 100% of our menu** ✅ *confirmed*
  - Fresh ingredients, cooked with care — food as nourishment for body and consciousness
  - Suitable for Ekadashi and festival days
- [ ] One **welcoming paragraph** for visitors new to the word “saatvik”
- [ ] Optional: small “Questions?” line pointing to phone when available
- [ ] **Guna classification** — explain Sattva / Rajas / Tamas in plain terms (one-liner each)
- [ ] **“Why we avoid” mini-copy** — onion & garlic: Rajasic + Tamasic (agitate nervous system); mushrooms: grow in darkness/decay, carry Tamasic inertia. Flavor enhanced with cumin, ginger, coriander, turmeric, cardamom, hing + ghee/cold-pressed oils.
- [ ] **Scriptural anchor** — Bhagavad Gita 17.8: “Foods that promote longevity, purity, strength, health, happiness, and satisfaction—juicy, nourishing, wholesome, pleasing to the heart—are dear to those in the mode of goodness.”
- [ ] **FAQ-style transparency** (for tea/coffee/chips exceptions): main dishes 100% sattvic; standard teas/coffees, chips, and select dals prepared to-order upon request. Short FAQ: “Is everything on the menu 100% sattvic?” → answer.
- [ ] **Jain alignment** — because core kitchen is already 100% onion/garlic/mushroom-free, highlight that all regular dishes are Jain-adjacent; add “100% Onion, Garlic, & Root-Free” assurance for strict Jain guests

**Draft headline + lede (starting point — edit freely):**
> **Every dish is saatvik**  
> At Cafe Gopala, saatvik isn’t a label on a few items — it’s the whole menu. Pure vegetarian, with **no onion, no garlic, and no mushroom in any dish**: chaat, curries, breads, sweets, and chai included. Food cooked with care, the way Srila Prabhupada taught us to honour what we eat.

**Full research notes:** see **`SAATVIK-NOTES.md`** (scriptures, gunas, ISKCON tradition, draft copy, sources).

#### A2. About us — copy draft
- [ ] **Opening:** Cafe Gopala — a saatvik cafe, not a factory chain
- [ ] **Origin:** began as saatvik food for family and friends following Srila Prabhupada’s teachings
- [ ] **Today:** same spirit, now open to all — **dine in, takeaway, or order online**
- [ ] **Voice:** “we” as **Cafe Gopala** ✅ *confirmed* — no personal owner name on the page
- [ ] **Photo?** Optional later — no photo in repo yet; text-only is fine for v1
- [ ] **“What is Prasadam?”** mini-block — food prepared as Bhoga (offering) to Lord Krishna, then served as divine mercy; reference ISKCON Desire Tree concepts (food offered with love, purification of mind & soul, Vedic hospitality: “no one should go hungry”).
- [ ] **Sampradaya / founder identity** — explain Cafe Gopala is a devotional offering by a family of practitioners (servants of the Lord), not a conventional commercial enterprise; rooted in Sri Chaitanya Mahaprabhu’s teachings and the Brahma-Madhva-Gaudiya Sampradaya; lineage through the Six Goswamis of Vrindavan → Srila Prabhupada.

**Draft About copy (starting point — edit freely):**
> **About Cafe Gopala**  
> Cafe Gopala started with a simple wish: to cook wholesome saatvik food for family and friends who follow the teachings of Srila Prabhupada. What began at home grew into a cafe — but the heart is the same. Today we welcome you to dine in, pick up a takeaway, or order ahead online. Every plate is fully saatvik, made fresh, and served with the same care we would offer our own family.

**Draft "Founders & Tradition" copy (starting point — edit freely):**
> **Humble Servants of the Sampradaya**  
> Cafe Gopala is not run as a conventional commercial enterprise, but as a humble devotional offering operated by a family of practitioners (servants of the Lord). Our kitchen and service are guided by the timeless teachings of Sri Chaitanya Mahaprabhu and rooted in the authentic Brahma-Madhva-Gaudiya Sampradaya. Following the lineage passed down through the Six Goswamis of Vrindavan and brought to the modern world by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, our sole mission is to serve pure, sanctified food (Prasadam) prepared in total cleanliness, devotion, and compassion.

#### A3. Prabhupada quotes — curate list
- [ ] Pick **5–8 short quotes** about food, prasadam, Krishna consciousness, or simple living
- [ ] For each: English text + **source** (book, lecture date, or “Srila Prabhupada” if unknown)
- [ ] Keep quotes **short** (scroller works best under ~120 characters per line)
- [ ] Legal/ respectful use: attribute to “His Divine Grace A.C. Bhaktivedanta Swami Prabhupada”

**Starter ideas (verify sources before publish):**
- Themes: food offered in love, vegetarian diet, eating for health and consciousness
- We can pull verified quotes from prabhupadabooks.com or BBT sources in a later pass

**Curated from research material (verify before publish):**

*Prasadam / Krishna consciousness:*
1. “Food offered to Krishna becomes Prasadam, divine mercy. When one eats Prasadam, all past reactions of karma are cleansed and spiritual consciousness awakens.” — *Srila Prabhupada* (source: ISKCON Desire Tree)
2. “Simply by eating Krishna-prasadam, one can overcome all material contamination and advance in Krishna consciousness without a doubt.” — *Srila Prabhupada*
3. “Our Krishna consciousness movement is distributing Prasadam. We invite everyone: Come, eat sumptuously, remain healthy, and be Krishna conscious.” — *Srila Prabhupada*
4. “By eating food cooked in the mode of goodness and offered to Lord Krishna with devotion, one purified in mind and body advances easily on the spiritual path.” — *Srila Prabhupada*
5. “When food is prepared for Krishna with love and cleanliness, Krishna accepts it, and that food becomes spiritualized. That is Prasadam.” — *Srila Prabhupada*
6. “Prasadam is non-different from Krishna. Therefore, instead of considering Prasadam as ordinary food, one should respect it as Krishna Himself.” — *Srila Prabhupada*

*Sattvic food / mode of goodness (with references):*
1. “Foodstuffs in the mode of goodness—such as milk products, grains, fruits, and vegetables—increase the duration of life, purify existence, and give health, happiness, and satisfaction.” — *Srila Prabhupada* (Bhagavad-gita 17.8 Purport)
2. “If you eat sattvic food in the mode of goodness, your mind becomes calm and quiet. A peaceful mind can easily understand higher spiritual values.” — *Srila Prabhupada* (Lecture on Bg 17.8-10, Honolulu, May 24, 1975)
3. “The purpose of food is to increase the duration of life, purify the mind, and aid physical strength.” — *Srila Prabhupada* (Bhagavad-gita As It Is, 17.8)
4. “Vegetables, grain, fruits, milk, and water—these are the proper foods to be offered to the Lord. Cleanliness is essential. If one prepares food with devotion, cleanliness, and pure intention, Krishna accepts it.” — *Srila Prabhupada* (Srimad-Bhagavatam, 4.29.53 Purport)
5. “By accepting sattvic prasadam, fine brain tissues develop, enabling one to understand subtle spiritual truths.” — *Srila Prabhupada* (Light of the Bhagavata, Purport 29)

**Source article for further content:** https://food.iskcondesiretree.com/what-is-prasadam/ — key concepts: food offered with love (Bhoga), purification of mind & soul, Vedic hospitality (“no one should go hungry”).

---

### Phase B — Layout & look (implementation tasks)

#### B1. Navigation update
- [ ] Add nav links: **Saatvik** · **About** · **Jain** (anchor sections or separate page)
- [ ] Keep **Menu** · **Visit** · **Order online** CTA
- [ ] Mobile: hamburger or compact nav (currently nav links hide on small screens)

#### B2. New `#saatvik` section
- [ ] Section after hero (replaces strip)
- [ ] Visual: soft cream card or maroon band — match existing `.strip` / `.verse` language
- [ ] Icon row optional: 🌿 pure veg · 🚫 no onion/garlic · 🏠 homemade
- [ ] Accessible headings (`h2`), good contrast

#### B3. New `#about` section
- [ ] Two-column on desktop: text + optional decorative element (arch, garland, or small logo)
- [ ] Single column on mobile
- [ ] Link subtly to Gallery if we add videos page
- [ ] **Lineage visuals** — Parampara diagram (BBT courtesy), Sri Sri Gaura-Nitai, Six Goswamis / Sri Govindadev Ji, Srila Prabhupada portrait
- [ ] **Footer attribution** — “Images & verses from *Bhagavad-gītā As It Is* and ISKCON educational archives, courtesy of The Bhaktivedanta Book Trust (BBT), used with reverence under spiritual fair use, copyright © BBT.”

#### B4. Prabhupada quote scroller
- [ ] Horizontal auto-scroll, **slow** (~40–60s full loop)
- [ ] **Pause on hover** / focus for readability
- [ ] **`prefers-reduced-motion`:** show static quote (rotate on tap or show all stacked)
- [ ] Style: gold band (extend current `.verse` section) or cream with maroon text
- [ ] Separator between quotes: `{symbol}` or `{small flute icon}` — keep minimal
- [ ] **JS data structure** — use array of `{quote, ref}` objects (see A3 curated list), not plain strings, so source attribution renders inline
- [ ] **Images** — source circular (1:1, <100 KB webp) illustrations from ISKCON Desire Tree article; crop bottom 5% to remove watermark. Place beside quotes.

#### B5. Homepage slim-down
- [ ] Remove `.strip` section (Task B2 replaces it)
- [ ] Shorten Visit / order-options card (defer delivery URLs)
- [ ] Update hero lede to mention saatvik + homemade
- [ ] Update `<title>` and meta description for SEO (“saatvik vegetarian” not just “vegetarian”)

#### B6. Hero — animated logo (optional, decide in review)
- [ ] **Option A (light):** Keep current PNG cross-fade — zero weight added
- [ ] **Option B (recommended):** Replace or supplement with `<video autoplay muted loop playsinline>` using `cafe_gopala_animated_logo_clean.webm` + `.mp4` fallback, poster=`logo.png`
- [ ] Must respect `prefers-reduced-motion` → show static `logo.png` only
- [ ] Lazy-load video below the fold? No — hero is above fold; keep file small. **✅ Compressed: `cafe_gopala_animated_logo_clean_optimized.webm` is 453 KB (was 1.3 MB) and `_optimized.mp4` is 423 KB (was 3.2 MB).**

#### B7. Jain dining section / page
- [ ] **Title:** “Pure Jain Dining at Cafe Gopala” / Subtitle: “Prepared in Strict Harmony with Ahimsa & Satya”
- [ ] Explain: core kitchen is already 100% onion/garlic/mushroom-free; Jain guests get root-veg-free dishes too
- [ ] **Dedicated Jain-Friendly Menu** — every dish prepared strictly without root vegetables (no potatoes, carrots, radishes)
- [ ] **Kitchen protocol** — separate handling for root-veg dishes (samosas, fries) to avoid cross-contact with Jain offerings
- [ ] **Pure dairy & vegan** — clarify all ghee/paneer/milk is 100% pure vegetarian, no animal rennet or non-veg processing aids
- [ ] **Labeling** — distinguish “Naturally Jain” (regular menu items) vs. “Jain-on-Request” (customizable)
- [ ] **Why root vegetables are avoided** — harvesting kills the plant + destroys soil microorganisms (nigoda); explain this gently on the page
- [ ] **Jain substitution ingredients** — raw banana (kachha kela) replaces potato in samosas/tikkis/cutlets/gravies; pumpkin, bottle gourd, zucchini, tomatoes, cashew paste, and hing (asafoetida) for texture & flavor; note dried ginger/turmeric powder is permitted
- [ ] **Clarification notice text** (verbatim for homepage or jain-menu.html):
  > “Our core menu is 100% Sattvic (No Onion, Garlic, or Mushrooms). For our Jain guests, we offer dedicated Jain-Prep Options made with Raw Banana (instead of Potato) and strictly free of all underground root vegetables (no potatoes, carrots, radishes, onion, or garlic).”
- [ ] SEO: add meta description mentioning “Jain vegetarian Bengaluru” / “Ahimsa dining”

---

### Phase C — Videos (separate page — recommended)

**Recommendation:** Don’t embed multiple videos on the homepage. Add a lightweight **`gallery.html`** (or `our-story.html`):

- [ ] **Homepage:** one optional subtle hero video OR a text link: *“Watch our story →”*
- [ ] **Gallery page:**
  - Animated logo video (featured)
  - Space for 1–2 future clips (kitchen, festival, Ekadashi prep)
  - Back link to home + Order CTA
  - `noindex` until you’re happy with content (like `order.html`)
- [ ] **Review** `Love_it_thanks_…` and `No_Please_use_…` — rename to friendly titles if used; **don’t publish** if they’re internal design drafts
- [ ] Compress any video > 5 MB before deploy (HandBrake / ffmpeg) — keeps mobile fast

---

### Phase D — Polish & attractiveness

#### D1. Visual refresh (incremental)
- [ ] Slightly larger hero tagline; more whitespace between sections
- [ ] Subtle background texture or lotus/marigold watermark (CSS only, very faint)
- [ ] Consistent section eyebrows (“Our food”, “Our story”, “Wisdom”, “On the table”, “Come by”)
- [ ] Review `order.html` header/footer so it **matches** new homepage nav/branding (second pass)

#### D2. Accessibility & performance
- [ ] All new sections: logical heading order (one `h1`, then `h2`s)
- [ ] Quote scroller: screen-reader-friendly (don’t rely on motion alone)
- [ ] Video: `aria-label`, no autoplay sound
- [ ] Lighthouse check after changes (target: keep performance green on mobile)

---

## Deferred (blocked — do NOT block redesign)

| Item | Why deferred | Placeholder copy suggestion |
|------|--------------|----------------------------|
| Street address | Moving from Malleshwaram to new location | *“We’re moving to a new home in Bengaluru — address coming soon. Order online & collect still available.”* |
| Google Maps link | Needs real address | Hide link or point to generic Bengaluru until ready |
| Hours | May change with new shop | *“Hours at our new location will be posted here.”* |
| Phone number | Confirm if changing | Keep `[Add phone]` or temporary number |
| Zomato / Swiggy / Rapido URLs | Partner pages tied to old location | Single line: *“Delivery partners — updating for our new location”* |
| Footer locality | Says “Malleshwaram” | Change to “Bengaluru” or “New location coming soon” |
| JSON-LD / structured data | Needs real address | Wait until Visit section is final |

---

## Suggested order of work

| Order | Task | Why this order |
|-------|------|----------------|
| **1** | A1 + A2 + A3 — write copy & pick quotes | Content drives design; you can do this offline |
| **2** | B2 + B3 + B4 — add Saatvik, About, Quotes sections | Core story on the page |
| **3** | B5 — remove strip, slim Visit, update hero/meta | Declutter |
| **4** | B1 — nav links | Tie sections together |
| **5** | C — `gallery.html` + hero video decision | Optional media, isolated |
| **6** | D — polish + `order.html` consistency | Last pass |
| **Later** | Deferred address & delivery URLs | When move is confirmed |

---

#### A7. Careers page — placement & copy draft (added 2026-09-03)
- [x] Don't clutter top nav; add as small unobtrusive link in the **footer** of every page ✅
- [x] Standalone `careers.html` with a structured intake form
- [x] **Delivery: `mailto:` (no backend, no third party)** — opens the user's mail client with a pre-filled, well-formatted email. Simple, immediate, no extra service to run. CV file is mentioned in the field hint ("attach your CV/resume to the email before sending") because `mailto:` can't attach files cross-browser.
- [x] Form fields: **Name, Mobile, Email, Role (Cook / Service / Other), Years of experience, When can you start, Short message (≤ 400 chars).** No upload field.
- [x] Tone: respectful but firm — "We respect your time. Please keep your message short." Acknowledges the volume of CVs and the importance of showing up with the right attitude.
- [x] Pain points acknowledged: many emails with CVs, arrogant/difficult cook applicants, need a structured intake form to filter and standardise
- [x] Replace `careers@cafegopala.co.in` placeholder with the real email when known

**Draft copy (starting point — edit freely):**
> **Join our kitchen**  
> Cafe Gopala is a small saatvik kitchen on New BEL Road. When we hire, we hire for attitude first and skill second — a humble cook who will show up on time and listen is worth more than a brilliant one who won't. If that sounds like you, tell us a little about yourself. We read every email. We respect your time, so please keep it short.

**TODO (later, not in this pass):**
- [ ] Mirror Careers footer link in `order.html`, `reserve.html`, `story.html`, `reviews.html`, `404.html` (one-line edit each)
- [ ] Replace placeholder email `careers@cafegopala.co.in` with the real one
- [ ] Optionally: forward `mailto:` body through a server-side script when volume grows
- [ ] `jain-menu.html` (deferred until cafe is ready to publish the Jain menu details)

---

## Open decisions (answer whenever — not blocking Task 1)

- [x] **Owner name** — use **Cafe Gopala** only (no personal name) ✅ 2026-08-08
- [x] **No onion/garlic** — **100% of menu** ✅ 2026-08-08
- [x] **Cafe vs kitchen** — **Cafe Gopala**; dine-in + takeaway + online ✅ 2026-08-08
- [x] **“ISKCON”** in main copy — say explicitly ✅ 2026-08-08 — reference ISKCON teachings & Srila Prabhupada standards as the foundation; define terms (sattvic, prasadam) once
- [ ] **Quote scroller** — continuous marquee vs. fade one-at-a-time (recommend fade for readability)
- [ ] **Hero** — static logos vs. animated video (try video in Task 5; easy to revert)
- [ ] **Gallery page name** — `/gallery.html` vs. `/our-story.html`
- [ ] **South Indian menu** — still hidden in HTML comment; mention on site or stay North-Indian-forward until restored?
- [x] **Jain dining** — homepage section or separate `jain-menu.html` page; core kitchen already onion/garlic/mushroom-free; add root-veg-free Jain menu ✅ 2026-08-08

---

## Notes for future self

- **`integration_todo.md`** tracks FastPOS/API wiring — separate from this file.
- **`deployment_todo.md`** tracks server/DNS — separate.
- Do **not** delete logo/video files (per integration_todo do-not list).
- When new address is ready: update Visit, footer, meta, Maps link, JSON-LD, and partner URLs in one small pass.

---

## Quick checklist — “done” for this redesign

- [ ] Homepage tells the **saatvik + Prabhupada + Cafe Gopala** story clearly (100% no onion/garlic stated)
- [ ] Prabhupada quotes scroller live and accessible
- [ ] Homepage feels **less cluttered** than today
- [ ] **Jain dining** section or `jain-menu.html` page with root-veg-free menu + kitchen protocol + labeling
- [ ] Videos available but **not bulky** on main page
- [ ] Address/delivery honestly marked **coming soon** until move completes
- [ ] Live menu + order flow still work unchanged
