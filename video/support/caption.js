// The on-screen narration bubble.
//
// Two jobs: show the line, and record WHEN it showed so the voiceover can be
// spoken at the same moment. The dwell is paced to SPEAKING speed rather than
// reading speed — which is also what makes these watchable by someone who is
// following along on their own phone.
async function caption(page, text, ms = 700) {
  // No-op unless recording. HOWTO=1 shows the bubbles; SLOWMO also paces them.
  if (!process.env.HOWTO && !process.env.SLOWMO) return;
  if (page.__captions) {
    page.__captions.push({ dt: Date.now() - (page.__t0 || Date.now()), text });
  }
  const words = String(text).trim().split(/\s+/).length;
  ms = Math.max(ms, words * 430 + 600);   // ~140 wpm, with headroom for the TTS
  await page.evaluate((t) => {
    let el = document.getElementById('__howto_caption');
    if (!el) {
      el = document.createElement('div');
      el.id = '__howto_caption';
      el.style.cssText = [
        'position:fixed', 'top:16px', 'left:50%', 'transform:translateX(-50%)',
        'z-index:2147483647', 'max-width:min(680px,92vw)',
        // Cafe Gopala maroon rather than the POS's neutral grey — these videos
        // are the cafe's, and should look like it from the first frame.
        'background:rgba(62,18,6,.88)', 'backdrop-filter:blur(7px)',
        '-webkit-backdrop-filter:blur(7px)', 'color:#FCF4E2',
        'padding:11px 20px', 'border-radius:14px', 'text-align:center',
        'font:600 17px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        'box-shadow:0 6px 22px rgba(0,0,0,.3)', 'letter-spacing:.2px',
        'border:1px solid rgba(243,199,102,.45)',
        'pointer-events:none',           // never intercept a click beneath it
      ].join(';');
      document.body.appendChild(el);
    }
    el.textContent = t;
  }, text);
  if (process.env.SLOWMO) await page.waitForTimeout(ms);
}

module.exports = { caption };
