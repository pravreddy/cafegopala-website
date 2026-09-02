// HOW TO BOOK A TABLE — and, the part worth filming, choose the food in advance.
//
// Most people assume booking a table is all a restaurant site can do, so they
// never find the step that actually helps them: dishes chosen ahead means the
// kitchen has shopped and prepped for them, and nobody spends the first ten
// minutes of the meal reading a menu. If the video does not show it, it may as
// well not exist.
const { test, expect } = require('../support/narration');
const { caption } = require('../support/caption');
const { serveSite, configureDemoPos, useDemoConfig, emailedCodes } = require('../support/demo-pos');
const { proceedToCheckout, expectCartHasItems } = require('../support/actions');

const EMAIL = 'demo.guest@example.com';

function isoDaysAhead(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

test.describe('Reserve a table', () => {
  let site, cfg;

  test.beforeAll(async ({ request }) => {
    site = await serveSite();
    cfg = await configureDemoPos(request, site.origin);
  });

  test.afterAll(async () => { if (site) await site.close(); });

  test('How to book a table and choose your dishes', async ({ page, request }) => {
    await useDemoConfig(page, cfg);

    await test.step('Open the booking page', async () => {
      await page.goto(site.origin + '/reserve.html');
      await caption(page, 'To book a table, start with the day, how many are coming, and the time.');
    });

    await test.step('Day, party and time', async () => {
      await page.locator('#date').fill(isoDaysAhead(2));
      await caption(page, 'Pick your day. You can book up to two weeks ahead.');
      await page.locator('#party button[data-n="4"]').click();
      await caption(page, 'Tap how many people. The times below only show sittings that can still seat your group.');
      await expect(page.locator('#times button').first()).toBeVisible();
      await page.locator('#times button').first().click();
    });

    await test.step('Your details', async () => {
      await page.locator('#name').fill('Arjuna');
      await page.locator('#phone').fill('9876543211');
      await page.locator('#email').fill(EMAIL);
      await caption(page, 'Your email is checked once, so we can send you the booking and you can find it again later.');
      await page.locator('#sendCode').click();
      const { code } = await emailedCodes(request, cfg, EMAIL);
      await page.locator('#code').fill(code);
      await page.locator('#checkCode').click();
      await caption(page, 'Tell us the occasion if there is one, or if you need a high chair or a quiet corner.');
      await page.locator('#occasion').fill('Birthday');
    });

    await test.step('Hold the table', async () => {
      await page.locator('#book').click();
      await expect(page.locator('#result-area')).toBeVisible();
      await caption(page, 'The table is held for you. A small deposit confirms it — and it comes straight off your bill on the day.');
    });

    await test.step('Choose the food in advance', async () => {
      await caption(page, 'Here is the part most people miss. You can choose your dishes now, before you arrive.');
      const dishes = page.getByRole('link', { name: /choose my dishes/i });
      if (await dishes.count()) {
        await dishes.first().click();
        await expect(page.locator('#sec-menu')).toBeVisible();
        await caption(page, 'It is the same menu as ordering — tap Add on whatever you want.');
        await page.getByRole('button', { name: /^Add$/ }).first().click();
        await expectCartHasItems(page, expect);
        await proceedToCheckout(page);
        await expect(page.locator('#result-area')).toBeVisible();
        await caption(page, 'Your dishes are on the booking now. The kitchen can prep for you, and you are not left reading a menu.');
      }
    });

    await test.step('Finding it again', async () => {
      await caption(page, 'My bookings shows everything you have booked, and you can cancel from there any time.');
      await page.locator('#mine').click();
    });
  });
});
