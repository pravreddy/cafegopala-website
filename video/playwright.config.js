// Recording config for the customer how-to videos.
//
// baseURL is the POS API, not the website: the specs talk to the POS to set the
// demo restaurant up, and load the website from a throwaway local server that
// support/demo-pos.js starts. Keeping the two apart is what stops a recording
// ever reaching the live cafe.
const { defineConfig } = require('@playwright/test');

const SLOWMO = Number(process.env.SLOWMO || 0);

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // A narrated walkthrough speaks at human pace; three minutes is normal.
  timeout: (process.env.HOWTO || SLOWMO) ? 300000 : 90000,
  expect: { timeout: 15000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.POS_BASE_URL || 'http://localhost:8010',
    // A phone-shaped window would be truer to how customers order, but a
    // portrait video is unwatchable on a laptop and most people will see these
    // embedded on the site. Landscape, and the pages are responsive anyway.
    viewport: { width: 1280, height: 800 },
    video: 'on',
    trace: 'on',
    screenshot: 'only-on-failure',
    actionTimeout: 20000,
    launchOptions: { slowMo: SLOWMO },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
