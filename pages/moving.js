/*
  moving.js — "we are moving" notice + online ordering / reservations paused.
  ───────────────────────────────────────────────────────────────────────────
  ONE SWITCH. To turn everything back on when the new place opens, set
  MOVING to false below, commit, push. Nothing else to change.

      var MOVING = false;

  What it does while MOVING is true:
    • every page gets a strip at the very top saying we are moving
    • order.html and reserve.html stop working — the page body is replaced
      with the same notice, so nobody can place an order or book a table
      (the "Order & collect" buttons elsewhere still go there; they simply
       land on the notice instead of the shop)

  Included from every page in pages/ with one line before </body>:
      <script src="moving.js"></script>
  The site is served flat, so pages/moving.js is https://cafegopala.in/moving.js
*/
(function () {
  var MOVING = true;

  /* ── the words. Edit these, not the code below. ───────────────────────── */
  var FROM      = "Malleswaram";
  var TO        = "New BEL Road, next to M S Ramaiah Memorial Hospital";
  var STRIP     = "We are moving from " + FROM + " to " + TO +
                  ". Online ordering and table booking are paused until we reopen.";
  var HEADLINE  = "We are moving";
  var BODY      = "Cafe Gopala is moving from " + FROM + " to " + TO + ".";
  var PAUSED    = "Online ordering and table reservations are switched off until the move is finished. " +
                  "Please do not pay for anything here — we would only have to refund it.";
  var SOON      = "The opening date for the new place will be announced very soon. " +
                  "Thank you for your patience — we cannot wait to serve you there.";

  if (!MOVING) return;

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var isShop = page === "order.html" || page === "reserve.html";

  /* ── styles ───────────────────────────────────────────────────────────── */
  var css = document.createElement("style");
  css.textContent =
    '.cg-moving-strip{background:#3E1206;color:#FCF4E2;font-family:"Mukta",system-ui,sans-serif;' +
      'font-size:.95rem;line-height:1.5;text-align:center;padding:.7rem 1rem;' +
      'border-bottom:3px solid #E0A029}' +
    '.cg-moving-strip b{color:#F3C766}' +
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
    var strip = document.createElement("div");
    strip.className = "cg-moving-strip";
    strip.innerHTML = "\u{1F69A} <b>" + HEADLINE + ".</b> " + STRIP;
    document.body.insertBefore(strip, document.body.firstChild);

    if (!isShop) return;

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
      "<h1>" + HEADLINE + "</h1>" +
      "<p>" + BODY + "</p>" +
      "<p>" + PAUSED + "</p>" +
      '<p class="cg-soon">' + SOON + "</p>" +
      '<a class="cg-back" href="index.html">Back to the café</a>';

    var footer = document.querySelector("footer");
    if (footer) document.body.insertBefore(box, footer);
    else document.body.appendChild(box);

    document.title = HEADLINE + " — Cafe Gopala";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
