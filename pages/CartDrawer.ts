import { Page, Locator, expect } from '@playwright/test';

export class CartDrawer {
  readonly page: Page;
  readonly drawer: Locator;
  readonly closeButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedButton: Locator;
  readonly totalAmountText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.locator('aside');
    this.closeButton = page.locator('aside button:has-text("✕")');
    this.emptyCartMessage = page.locator('aside p:has-text("Cart is empty")');
    this.proceedButton = page.locator('aside button:has-text("Proceed for Order")');
    this.totalAmountText = page.locator('aside span.text-emerald-700');
  }

  /**
   * Close the cart slide-over drawer by clicking ✕ and waiting for slide transition.
   */
  async close() {
    await this.closeButton.click({ noWaitAfter: true });
    // Wait for drawer to slide out with translate-x-full
    await this.page.locator('aside.translate-x-full').waitFor({ state: 'attached', timeout: 5000 });
    // Brief transition settle time
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if the cart shows empty state.
   */
  async isEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  /**
   * Get the total amount shown in the cart (e.g. ₹280 -> 280).
   */
  async getTotalAmount(): Promise<number> {
    const text = await this.totalAmountText.innerText();
    const clean = text.replace(/[^0-9]/g, '');
    return parseInt(clean, 10);
  }

  /**
   * Click "Proceed for Order" which navigates to /checkout.
   */
  async proceedToCheckout() {
    await expect(this.proceedButton).toBeEnabled();
    await this.proceedButton.click();
    await this.page.waitForURL('**/checkout', { timeout: 10000 });
  }
}
