/*
  moving.js — site-wide notice strip + per-page "not open yet" switches.
  ───────────────────────────────────────────────────────────────────────────
  TWO SWITCHES, one per shop page. Edit these and the words below, not the
  code further down. Commit + push = deploy.

      ORDERING_PAUSED      true  -> order.html shows a notice, no cart
      RESERVATIONS_PAUSED  true  -> reserve.html shows a notice, no booking

  22 Sep 2026 (Ekadashi): trial opening. Order & collect ON, table booking
  still OFF while the kitchen is finished.

  THE DATE SWITCH — OPENING_UNTIL below. Until that date every page shows the
  "Now open" strip and the home page keeps ONE purple bar that fades between
  the next Ekadashi and today's festivals. From that date on, with no commit
  or push: the strip hides itself, and the home page splits the purple bar
  into two lines — Ekadashi fixed, today's festivals fading underneath
  (index.html reads window.CG_OPENING_UNTIL). Change the date here only.

  ⚠ These only change what the WEBSITE shows. The real switch is in FastPOS:
     Settings -> Orders ("Online orders" enabled) and the table-booking
     "enabled" toggle. Keep the two in step — a direct FastPOS link ignores
     this file.

  Included from every page in pages/ with one line before </body>:
    <script src="moving.js"></script>
  The site is served flat, so pages/moving.js is https://cafegopala.in/moving.js
*/
var CG_OPENING_UNTIL = window.CG_OPENING_UNTIL = "2026-10-01";   /* YYYY-MM-DD, visitor's own date */

(function () {
  var ORDERING_PAUSED     = false;
  var RESERVATIONS_PAUSED = true;

  /* ── the words. Edit these, not the code below. ───────────────────────── */
  // the strip on every page ("" = no strip)
  var STRIP_HEAD = "Now open.";
  var STRIP      = "Order &amp; collect — order up to a week ahead, at least 4 hours before pickup. " +
                   "Table booking soon. " +
                   '<a href="tel:+919449444469">+91 94494 44469</a>';

  // what reserve.html / order.html show while paused
  var NOTICE = {
    "reserve.html": {
      title: "Table booking — coming soon",
      body:  "We are still finishing the kitchen, so online table booking is not open yet.",
      next:  "Order &amp; collect is open now — you can order up to a week ahead, and at least 4 hours before pickup. " +
             'Questions? Call <a href="tel:+919449444469">+91 94494 44469</a> or ' +
             '<a href="tel:+919449444415">+91 94494 44415</a>.',
      link:  ["order.html", "Order &amp; collect"]
    },
    "order.html": {
      title: "Online ordering is paused",
      body:  "Online ordering is switched off for now. Please do not pay for anything here — we would only have to refund it.",
      next:  'Please call <a href="tel:+919449444469">+91 94494 44469</a> and we will help.',
      link:  ["index.html", "Back to the café"]
    }
  };

  // after OPENING_UNTIL the strip retires itself (ISO dates compare as text)
  var d = new Date();
  var todayIso = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  if (todayIso >= CG_OPENING_UNTIL) STRIP = "";

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var paused = (page === "order.html" && ORDERING_PAUSED) ||
               (page === "reserve.html" && RESERVATIONS_PAUSED);
  if (!STRIP && !paused) return;

  /* ── styles ───────────────────────────────────────────────────────────── */
  var css = document.createElement("style");
  css.textContent =
    '.cg-moving-strip{background:#3E1206;color:#FCF4E2;font-family:"Mukta",system-ui,sans-serif;' +
      'font-size:.95rem;line-height:1.5;text-align:center;padding:.7rem 1rem;' +
      'border-bottom:3px solid #E0A029}' +
    '.cg-moving-strip b{color:#F3C766}' +
    '.cg-moving-strip a,.cg-moving-box .cg-soon a{color:inherit;text-decoration:underline}' +
    '.cg-moving-box{width:min(680px,92vw);margin:3.5rem auto 4rem;background:#FCF4E2;' +
      'border:1px solid rgba(62,18,6,.14);border-top:5px solid #E4611C;border-radius:14px;' +
      'padding:2.4rem 2rem;text-align:center;color:#2A130A;' +
      'font-family:"Mukta",system-ui,sans-serif;box-shadow:0 10px 30px rgba(62,18,6,.10)}' +
    '.cg-moving-box h1{font-family:"Cormorant Garamond",Georgia,serif;font-size:2.4rem;' +
      'line-height:1.1;margin:0 0 1rem;color:#3E1206}' +
    '.cg-moving-box p{margin:0 0 1rem;font-size:1.05rem}' +
    '.cg-moving-box .cg-soon{color:#835435}' +
    '.cg-moving-box a.cg-back{display:inline-block;margin-top:1rem;background:#E4611C;color:#FCF4E2;' +
      'text-decoration:none;font-weight:600;padding:.75rem 1.5rem;border-radius:999px}';
  document.head.appendChild(css);

  function start() {
    /* the strip, above everything, on every page */
    var strip = null;
    if (STRIP) {
      strip = document.createElement("div");
      strip.className = "cg-moving-strip";
      strip.innerHTML = "\u{1FA94} <b>" + STRIP_HEAD + "</b> " + STRIP;
      document.body.insertBefore(strip, document.body.firstChild);
    }

    if (!paused) return;
    var n = NOTICE[page];

    /* order.html / reserve.html: nothing below the header survives */
    var keep = { HEADER: 1, FOOTER: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, LINK: 1 };
    Array.prototype.slice.call(document.body.children).forEach(function (el) {
      if (el === strip) return;
      if (keep[el.tagName]) return;
      el.style.display = "none";
    });

    /* the header's Cart / My orders buttons have nothing to do any more */
    var acts = document.querySelector(".nav-actions, #mine");
    if (acts) acts.style.display = "none";

    var box = document.createElement("div");
    box.className = "cg-moving-box";
    box.innerHTML =
      "<h1>" + n.title + "</h1>" +
      "<p>" + n.body + "</p>" +
      '<p class="cg-soon">' + n.next + "</p>" +
      '<a class="cg-back" href="' + n.link[0] + '">' + n.link[1] + "</a>";

    var footer = document.querySelector("footer");
    if (footer) document.body.insertBefore(box, footer);
    else document.body.appendChild(box);

    document.title = n.title + " — Cafe Gopala";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
