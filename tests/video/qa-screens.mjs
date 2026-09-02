// qa-screens.mjs — free multi-device preview of the whole site, in one command.
//
//   cd video && node qa-screens.mjs            # screenshots every page × device
//   open qa-shots/                             # eyeball them before pushing
//
// Also FAILS LOUDLY on the two classic mobile bugs:
//   • horizontal overflow (page wider than the phone)
//   • an element hidden under the sticky header at the top of the page
import { chromium, devices } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
import { fileURLToPath } from 'url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'order.html', 'reserve.html', 'story.html', '404.html'];
const DEVICES = {
  'iphone-se':   devices['iPhone SE'],
  'iphone-15':   devices['iPhone 15'],
  'pixel-7':     devices['Pixel 7'],
  'ipad':        devices['iPad (gen 7)'],
  'desktop':     { viewport: { width: 1440, height: 900 } },
};
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml',
  '.webm':'video/webm', '.mp4':'video/mp4', '.json':'application/json', '.xml':'application/xml', '.txt':'text/plain' };

const server = http.createServer((req, res) => {
  const f = path.join(SITE, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(f, (e, d) => e ? (res.writeHead(404), res.end('nope'))
    : (res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }), res.end(d)));
}).listen(0);
const base = () => `http://localhost:${server.address().port}`;

const outDir = path.join(SITE, 'video', 'qa-shots');
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
let problems = [];
for (const [dname, dev] of Object.entries(DEVICES)) {
  const ctx = await browser.newContext({ ...dev });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(`${base()}/${p}`, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `${p.replace('.html','')}--${dname}.png`), fullPage: true });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) problems.push(`✗ ${p} on ${dname}: horizontal overflow of ${overflow}px`);
    const clipped = await page.evaluate(() => {
      const h1 = document.querySelector('h1'); if (!h1) return false;
      const r = h1.getBoundingClientRect();
      const el = document.elementFromPoint(Math.min(r.left + r.width/2, innerWidth-2), Math.max(r.top + 2, 2));
      return r.top < 0 || (el && el !== h1 && !h1.contains(el) && el.closest('header') !== null);
    });
    if (clipped) problems.push(`✗ ${p} on ${dname}: <h1> sits under the sticky header`);
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log(`\n${Object.keys(DEVICES).length * PAGES.length} screenshots → video/qa-shots/`);
if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
console.log('✓ no overflow, no clipped headings');
