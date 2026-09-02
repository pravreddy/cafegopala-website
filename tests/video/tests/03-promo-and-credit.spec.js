// HOW TO USE A PROMO CODE OR YOUR CREDIT.
//
// Both are money the customer is already owed, and both go unspent for the same
// reason: nobody tells them where the box is. So the video is short and the
// setup — earning the coupon — happens off camera through the API. What a
// viewer needs is the twenty seconds at checkout, not the backstory.
const { test, expect } = require('../support/narration');
const { caption } = require('../support/caption');
const { serveSite, configureDemoPos, useDemoConfig, emailedCodes } = require('../support/demo-pos');
const { proceedToCheckout, expectCartHasItems } = require('../support/actions');

const EMAIL = 'demo.regular@example.com';
const PHONE = '9876543212';

function isoDaysAhead(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

test.describe('Promo code and store credit', () => {
  let site, cfg, promoCode;

  test.beforeAll(async ({ request }) => {
    site = await serveSite();
    cfg = await configureDemoPos(request, site.origin);

    // Off camera: earn a 50% coupon the way a real customer does — register,
    // verify, then redeem the free launch coupon at the counter, which is what
    // issues the follow-up. Faked coupons would film a flow that cannot happen.
    const campaign = await (await request.post('/api/promo/campaigns/', {
      headers: cfg.headers,
      data: {
        name: 'Launch', start_date: isoDaysAhead(-1), end_date: isoDaysAhead(20),
        discount_tiers: [100, 50, 25],
        options: [{ label: 'Full meal', daily_cap: 50, value: '150' }],
      },
    })).json();

    const info = await (await request.get(`/api/promo/public/${campaign.public_code}/`)).json();
    await request.post(`/api/promo/public/${campaign.public_code}/register/`, {
      data: { name: 'Arjuna', phone: PHONE, email: EMAIL,
              option_id: info.options[0].id, day: isoDaysAhead(0) },
    });
    const codes = await emailedCodes(request, cfg, EMAIL);
    await request.post(`/api/promo/public/${campaign.public_code}/verify/`, {
      data: { phone: PHONE, code: codes.promo_code },
    });
    const redeemed = await request.post('/api/promo/redeem/', {
      headers: cfg.headers, data: { code: codes.coupon_code },
    });
    if (redeemed.ok()) {
      const body = await redeemed.json();
      promoCode = body.next_tier && body.next_tier.code;
    }
    test.skip(!promoCode, 'could not mint a follow-up coupon on the demo POS — skipping this video');
  });

  test.afterAll(async () => { if (site) await site.close(); });

  test('How to use a promo code or your credit', async ({ page, request }) => {
    await useDemoConfig(page, cfg);

    await test.step('Build a basket', async () => {
      await page.goto(site.origin + '/order.html');
      await page.getByRole('button', { name: /^Add$/ }).first().click();
      await expectCartHasItems(page, expect);
      await proceedToCheckout(page);
      await page.locator('#days .day').nth(1).click();
      await page.locator('.slot').first().click();
      await page.locator('#to-contact').click();
    });

    await test.step('Verify who you are', async () => {
      await page.locator('#f-name').fill('Arjuna');
      await page.locator('#f-phone').fill(PHONE);
      await page.locator('#f-email').fill(EMAIL);
      await page.locator('#send-code').click();
      const { code } = await emailedCodes(request, cfg, EMAIL);
      await page.locator('#f-code').fill(code);
      await page.getByRole('button', { name: /^Verify$/ }).click();
      await expect(page.locator('#email-ok')).toBeVisible();
      await caption(page, 'Promo codes and credit belong to you, so we check your email first.');
    });

    await test.step('Apply the promo code', async () => {
      await caption(page, 'If we have sent you a promo code, type it here and tap Apply.');
      await page.locator('#f-promo').fill(promoCode);
      await page.locator('#promo-btn').click();
      await expect(page.locator('#promo-ok')).toBeVisible();
      await caption(page, 'It tells you what it is worth straight away — before you order, not after.');
    });

    await test.step('Store credit, if you have any', async () => {
      const visible = await page.locator('#credit-block').isVisible().catch(() => false);
      if (visible) {
        await caption(page, 'If we owe you credit — from an order you cancelled — it is here already ticked.');
        await caption(page, 'Untick it to save it for a bigger order. It is yours either way, and it does not expire this week.');
      } else {
        await caption(page, 'If we ever owe you credit, a box appears here to spend it. Nothing to type — it finds it for you.');
      }
    });

    await test.step('Pay the rest', async () => {
      await page.locator('#place-btn').click();
      await caption(page, 'The discount comes off the food first, then any credit pays what is left. You pay only the difference.');
    });
  });
});
