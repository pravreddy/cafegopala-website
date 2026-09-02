// Serving THIS website locally and pointing it at a demo POS.
//
// THE RULE THIS FILE ENFORCES: a recording must never touch the real cafe.
// The site ships pointing at the live POS, so without care a recording run
// would place real orders, hold real tables and email real people. Three
// things stop that, and all three have to hold:
//
//   1. the pages read window.CG_CONFIG when it exists — a small seam that is
//      absent in production — so we repoint them at the demo POS before any
//      page script runs;
//   2. the site is served from a throwaway server on 127.0.0.1, so the
//      deployed copy is never loaded even by accident;
//   3. refuseLivePos() below hard-stops if the POS URL looks like production.
//
// Nothing here reads the POS source code. It talks to a POS over HTTP — a URL
// and a login — exactly as the website does in production. That is the whole
// boundary, and it is why these videos can live in the cafe's own repo.
const fs = require('fs');
const http = require('http');
const path = require('path');

const SITE_DIR = process.env.SITE_DIR || path.join(__dirname, '..', '..');

const POS = {
  base: process.env.POS_BASE_URL || 'http://localhost:8010',
  register: process.env.POS_REGISTER || 'DEMO001',
  user: process.env.POS_USER || 'owner',
  password: process.env.POS_PASSWORD || 'demo-pass-123',
};

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.xml': 'application/xml', '.txt': 'text/plain',
};

/** Hard stop if someone points a recording at production. */
function refuseLivePos() {
  const b = POS.base.toLowerCase();
  if (b.includes('app.fastpos.in') || b.includes('pos.cafegopal')) {
    throw new Error(
      'Refusing to record against the LIVE POS (' + POS.base + '). These specs ' +
      'place orders, hold tables and verify email addresses. Point POS_BASE_URL ' +
      'at a demo server.');
  }
}

/** Serve the website folder on a random free port. Returns { origin, close }. */
async function serveSite() {
  const root = path.resolve(SITE_DIR);
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/' || rel === '') rel = '/index.html';
    const full = path.join(root, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    if (!full.startsWith(root)) { res.writeHead(403); return res.end(); }
    fs.readFile(full, (err, buf) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(r => server.close(r)),
  };
}

/**
 * Set the demo restaurant up to take online orders and bookings from `origin`,
 * through the ORDINARY owner API — the same path a real owner walks. If an
 * owner could not switch their restaurant on this way, the recording should
 * fail, because then neither could they.
 */
async function configureDemoPos(request, origin) {
  refuseLivePos();
  const login = await request.post('/api/auth/login/', {
    data: { restaurant: POS.register, username: POS.user, password: POS.password },
  });
  if (!login.ok()) {
    throw new Error(`could not sign in to the demo POS at ${POS.base} (${login.status()}). ` +
      'Is the demo stack up, and are POS_REGISTER / POS_USER / POS_PASSWORD right?');
  }
  const headers = { Authorization: 'Token ' + (await login.json()).token };

  const patched = await request.patch('/api/tenant/', {
    headers,
    data: {
      menu_share_enabled: true,
      menu_share_origins: origin,
      upi_vpa: 'demo@okhdfc',
      upi_payee_name: 'Demo Cafe',
    },
  });
  if (!patched.ok()) throw new Error('could not enable public sharing: ' + patched.status());
  const tenant = await patched.json();

  const ordering = await request.patch('/api/pickup/policy/', {
    headers, data: { enabled: true, max_orders_per_slot: 5, max_advance_days: 7 },
  });
  if (!ordering.ok()) throw new Error('could not enable ordering: ' + ordering.status());

  const bookings = await request.patch('/api/reservations/policy/', {
    headers,
    data: { enabled: true, allow_preorder: true, deposit_per_head: '100', max_party_size: 8 },
  });
  if (!bookings.ok()) throw new Error('could not enable bookings: ' + bookings.status());

  return { base: POS.base, slug: tenant.slug, key: tenant.menu_share_key, headers };
}

/**
 * Point the site at the demo POS before any page script runs, and clear stored
 * state — a leftover email token from an earlier recording would skip the
 * verification step, which is the step viewers most need to see.
 */
async function useDemoConfig(page, cfg) {
  await page.addInitScript((c) => {
    window.CG_CONFIG = { base: c.base, slug: c.slug, key: c.key };
    try { localStorage.clear(); } catch (e) {}
  }, cfg);
}

/**
 * The 6-digit code the customer was "emailed", via the POS's test hook. The
 * hook is inert unless that server has E2E_TEST_HOOKS on — which a production
 * POS does not.
 */
async function emailedCodes(request, cfg, email) {
  const r = await request.get(
    `/api/_test/pickup-code/?slug=${encodeURIComponent(cfg.slug)}&email=${encodeURIComponent(email)}`);
  if (!r.ok()) {
    throw new Error(`no verification code for ${email}. The demo POS needs E2E_TEST_HOOKS=1 ` +
      '(the throwaway e2e stack sets it; a normal server does not).');
  }
  return r.json();
}

module.exports = { POS, SITE_DIR, serveSite, configureDemoPos, useDemoConfig, emailedCodes, refuseLivePos };
