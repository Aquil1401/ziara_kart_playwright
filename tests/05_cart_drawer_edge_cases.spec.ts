import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartDrawer } from '../pages/CartDrawer';
import { testData } from '../testdata/ziarakart.data';

test.describe('ZiaraKart Cart Drawer Edge Cases', () => {
  let homePage: HomePage;
  let cartDrawer: CartDrawer;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartDrawer = new CartDrawer(page);

    await homePage.setupDealerAccess(
      testData.dealerAuth.token,
      testData.dealerAuth.shop,
      testData.dealerAuth.owner
    );

    await homePage.navigate('/');
    await homePage.waitForProductsToLoad();
  });

  test('TC14 - Empty cart displays empty message and disabled proceed button', async () => {
    await homePage.openCart();
    expect(await cartDrawer.isEmpty()).toBe(true);

    // Verify Proceed button is disabled when cart has 0 items
    await expect(cartDrawer.proceedButton).toBeDisabled();

    await cartDrawer.close();
  });

  test('TC15 - Decrementing product to zero removes item and resets cart', async () => {
    const firstProductName = (await homePage.getVisibleProductTitles())[0];

    // Add 1 item
    await homePage.addProductToCart(firstProductName);
    await expect.poll(async () => await homePage.getCartCount()).toBe(1);

    // Decrement item to 0
    await homePage.decrementProductQuantity(firstProductName);
    await expect.poll(async () => await homePage.getCartCount()).toBe(0);

    // Open Cart drawer -> verify it is empty again
    await homePage.openCart();
    expect(await cartDrawer.isEmpty()).toBe(true);
    await expect(cartDrawer.proceedButton).toBeDisabled();

    await cartDrawer.close();
  });
});
