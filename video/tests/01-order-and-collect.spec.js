// HOW TO ORDER AND COLLECT — the walkthrough for a customer who has never used
// the site.
//
// They are probably on a phone, probably in a hurry, and will close the tab
// rather than ask anybody. So this moves one idea at a time and does NOT skip
// the two awkward steps — the emailed code and the UPI reference number.
// Those are precisely where a first-time customer stops, and a video that
// glosses over them teaches nothing.
const { test, expect } = require('../support/narration');
const { caption } = require('../support/caption');
const { serveSite, configureDemoPos, useDemoConfig, emailedCodes } = require('../support/demo-pos');
const { proceedToCheckout, expectCartHasItems } = require('../support/actions');

const EMAIL = 'demo.customer@example.com';

test.describe('Order and collect', () => {
  let site, cfg;

  test.beforeAll(async ({ request }) => {
    site = await serveSite();
    cfg = await configureDemoPos(request, site.origin);
  });

  test.afterAll(async () => { if (site) await site.close(); });

  test('How to order online and collect', async ({ page, request }) => {
    await useDemoConfig(page, cfg);

    await test.step('Start at the cafe', async () => {
      await page.goto(site.origin + '/index.html');
      await caption(page, 'Everything on our menu can be ordered ahead and collected from the counter.');
      await page.getByRole('link', { name: /order online now/i }).first().click();
      await expect(page.locator('#sec-menu')).toBeVisible();
    });

    await test.step('Choose the food', async () => {
      await caption(page, 'This is the real kitchen menu. If a dish has finished for the day, you will see it greyed out.');
      await page.locator('#menu-search').fill('dosa');
      await caption(page, 'Search for a dish, or tap a heading to open that section.');
      await page.getByRole('button', { name: /^Add$/ }).first().click();
      await caption(page, 'Tap Add. Your order builds up on the right as you go.');
      await expectCartHasItems(page, expect);
    });

    await test.step('Pick a collection time', async () => {
      await proceedToCheckout(page);
      await expect(page.locator('#sec-slot')).toBeVisible();
      await caption(page, 'Choose the day you want to collect. You can order up to a week ahead.');
      await page.locator('#days .day').nth(1).click();     // tomorrow: today's service may be over
      await caption(page, 'Then pick a time. Times that are nearly full tell you how many are left.');
      await page.locator('.slot').first().click();
      await page.locator('#to-contact').click();
      await expect(page.locator('#sec-contact')).toBeVisible();
    });

    await test.step('Your details', async () => {
      await caption(page, 'Your name and phone number are for the counter, so they know whose order it is.');
      await page.locator('#f-name').fill('Arjuna');
      await page.locator('#f-phone').fill('9876543210');
      await page.locator('#f-email').fill(EMAIL);
      await caption(page, 'Your email is checked once. That is what lets you find your order from any phone later.');
      await page.locator('#send-code').click();
      await expect(page.locator('#code-row')).toBeVisible();
    });

    await test.step('The code from your email', async () => {
      const { code } = await emailedCodes(request, cfg, EMAIL);
      await caption(page, 'A six-digit code arrives by email. Type it in and tap Verify.');
      await page.locator('#f-code').fill(code);
      await page.getByRole('button', { name: /^Verify$/ }).click();
      await expect(page.locator('#email-ok')).toBeVisible();
      await caption(page, 'Done — and you will not be asked again on this phone for a month.');
    });

    await test.step('Place the order', async () => {
      await page.locator('#place-btn').click();
      await expect(page.locator('#sec-pay')).toBeVisible();
      await caption(page, 'Now you pay. Scan the code with any UPI app, or tap the button if you are on your phone.');
      await expect(page.locator('#pay-amount')).not.toBeEmpty();
    });

    await test.step('Tell us you have paid', async () => {
      await caption(page, 'After paying, your UPI app shows a twelve-digit reference number. Type it here.');
      await page.locator('#f-utr').fill('428671903215');
      // #claim-btn, not the button's text: the pay screen also has "I've paid
      // but can't find the UTR", and a name match hits both. The id is the one
      // that means "I typed the reference and I am done".
      await page.locator('#claim-btn').click();
      await expect(page.locator('#sec-status')).toBeVisible();
      await caption(page, 'We check the payment and confirm. This page updates itself — keep the link, it is your order slip.');
    });

    await test.step('Finding it again', async () => {
      await caption(page, 'My orders shows everything you have ordered, on any phone, as long as you use the same email.');
      await page.locator('.hcart').click();
      await expect(page.locator('#sec-orders')).toBeVisible();
    });
  });
});
