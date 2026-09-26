import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartDrawer } from '../pages/CartDrawer';
import { CheckoutPage } from '../pages/CheckoutPage';
import { testData } from '../testdata/ziarakart.data';

test.describe('ZiaraKart Dealer E2E: Cart, Quantity & WhatsApp Order Placement', () => {
  let homePage: HomePage;
  let cartDrawer: CartDrawer;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartDrawer = new CartDrawer(page);
    checkoutPage = new CheckoutPage(page);

    // Setup authenticated dealer access
    await homePage.setupDealerAccess(
      testData.dealerAuth.token,
      testData.dealerAuth.shop,
      testData.dealerAuth.owner
    );

    await homePage.navigate('/');
    // Handle initial product catalog loading
    await homePage.waitForProductsToLoad();
  });

  test('TC12 - Dealer can add items to cart, modify quantity, and inspect live cart total', async () => {
    // 1. Initial Cart should be 0
    const initialCartCount = await homePage.getCartCount();
    expect(initialCartCount).toBe(0);

    // 2. Select first available product and click Add
    const firstProductName = (await homePage.getVisibleProductTitles())[0];
    await homePage.addProductToCart(firstProductName);

    // 3. Verify header cart counter increments to 1
    await expect.poll(async () => await homePage.getCartCount()).toBe(1);

    // 4. Increment quantity with "+" button
    await homePage.incrementProductQuantity(firstProductName);
    await expect.poll(async () => await homePage.getCartCount()).toBe(2);
    expect(await homePage.getCardQuantity(firstProductName)).toBe(2);

    // 5. Open Cart Drawer and verify total
    await homePage.openCart();
    expect(await cartDrawer.isEmpty()).toBe(false);
    const cartTotal = await cartDrawer.getTotalAmount();
    expect(cartTotal).toBeGreaterThan(0);

    // 6. Close Cart Drawer
    await cartDrawer.close();
  });

  test('TC13 - Full Purchase Journey: Add to cart, proceed to checkout, submit order via WhatsApp', async ({ page }) => {
    // 1. Add product to cart
    const firstProductName = (await homePage.getVisibleProductTitles())[0];
    await homePage.addProductToCart(firstProductName);
    await expect.poll(async () => await homePage.getCartCount()).toBe(1);

    // 2. Open Cart drawer and click "Proceed for Order"
    await homePage.openCart();
    await cartDrawer.proceedToCheckout();

    // 3. Verify URL is /checkout
    expect(page.url()).toContain('/checkout');

    // 4. Fill Delivery Details on checkout page
    await checkoutPage.fillDeliveryDetails(testData.checkoutCustomer);

    // 5. Place order and intercept the generated WhatsApp message URL
    const whatsappUrl = await checkoutPage.submitOrderAndInterceptWhatsApp();

    // 6. Verify WhatsApp URL structure and payload details
    expect(whatsappUrl).toBeTruthy();
    expect(whatsappUrl).toContain(testData.supportWhatsAppNumber);
    expect(whatsappUrl).toContain('New ZiaraKart Wholesale Order');
    expect(whatsappUrl).toContain(testData.checkoutCustomer.shopName);
    expect(whatsappUrl).toContain(testData.checkoutCustomer.ownerName);
    expect(whatsappUrl).toContain(testData.checkoutCustomer.phone);

    // 7. Verify order confirmation screen appears in the application
    await expect(checkoutPage.thankYouMessage).toBeVisible();
    await expect(page.locator('text=Your order has been sent to us on WhatsApp')).toBeVisible();
  });
});
