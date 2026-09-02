// Small helpers for driving THIS site, kept apart from the POS plumbing.
//
// WHY THIS FILE EXISTS: the ordering page has two cart interfaces, and which
// one is on screen depends on the window width. Under 900px you get the fixed
// bar along the bottom (#cartbar) with its Proceed button; at desktop width
// that bar stays hidden and the cart is the sticky side panel instead, whose
// button is #side-continue. Both call the same proceed().
//
// The recordings run at 1280px — a portrait phone video is unwatchable on a
// laptop and these are meant to be embedded on the site — so they get the side
// panel. Writing to whichever is actually visible means the specs keep working
// if the viewport in playwright.config.js ever changes, which is exactly the
// kind of coupling that would otherwise break them silently months later.

/** Click whichever "Proceed" the current layout is showing. */
async function proceedToCheckout(page) {
  const side = page.locator('#side-continue');
  if (await side.isVisible().catch(() => false)) {
    await side.click();
    return;
  }
  await page.locator('#preorder-btn').click();
}

/** Wait until the basket actually holds something, in either layout. */
async function expectCartHasItems(page, expect) {
  // .cline rows are rendered into BOTH carts, so this is layout-independent.
  await expect(page.locator('.cline').first()).toBeVisible();
}

module.exports = { proceedToCheckout, expectCartHasItems };
