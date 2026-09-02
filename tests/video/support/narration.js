// Narrated test wrapper. Import { test, expect } from here instead of
// '@playwright/test' and every caption() call is logged with its video-relative
// timestamp into <test-output-dir>/captions.json — which narrate-clip.py turns
// into a synced voiceover.
//
// (Same idea as the FastPOS e2e suite's version. Copied rather than shared on
// purpose — see README: this folder depends on a POS over HTTP, never on the
// POS source.)
const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');

const test = base.test.extend({
  page: async ({ page }, use, testInfo) => {
    page.__t0 = Date.now();          // ≈ video start (context creation)
    page.__captions = [];
    await use(page);
    try {
      if (page.__captions.length) {
        fs.mkdirSync(testInfo.outputDir, { recursive: true });
        fs.writeFileSync(path.join(testInfo.outputDir, 'captions.json'),
                         JSON.stringify(page.__captions, null, 1));
      }
    } catch (e) { /* narration is best-effort — never fail a recording over it */ }
  },
});

module.exports = { test, expect: base.expect };
