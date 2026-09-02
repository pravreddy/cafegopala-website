// The Cafe Gopala title card shown before each chapter. Rendered by Chromium
// (Playwright is here anyway) rather than ffmpeg's drawtext filter, which is
// not compiled into every ffmpeg build.
//   node make-title-card.mjs "How To Order Online And Collect" out.png
import { chromium } from '@playwright/test';

const title = (process.argv[2] || 'Cafe Gopala').replace(/[<>&]/g, c =>
  ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const out = process.argv[3] || 'card.png';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mukta:wght@400;600&display=swap" rel="stylesheet">
</head><body style="margin:0;display:flex;flex-direction:column;align-items:center;
  justify-content:center;height:100vh;background:#3E1206;
  font-family:Mukta,-apple-system,'Helvetica Neue',Arial,sans-serif">
  <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:74px;
    font-weight:700;color:#F3C766;letter-spacing:.5px">Cafe Gopala</div>
  <div style="font-size:19px;color:rgba(252,244,226,.7);margin-top:2px;
    letter-spacing:.14em;text-transform:uppercase">The Flavor of Krishna's Grace</div>
  <div style="width:64px;height:2px;background:#E4611C;margin:30px 0"></div>
  <div style="font-size:38px;color:#FCF4E2;max-width:1000px;text-align:center;
    line-height:1.3">${title}</div>
  <div style="position:absolute;bottom:36px;font-size:17px;color:rgba(252,244,226,.5)">
    New BEL Road, Bengaluru</div>
</body></html>`);
await page.waitForTimeout(700);          // let the webfont land before the shot
await page.screenshot({ path: out });
await browser.close();
