import { Page, Locator, expect } from '@playwright/test';

export interface CustomerOrderDetails {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
}

export class CheckoutPage {
  readonly page: Page;
  readonly shopInput: Locator;
  readonly ownerInput: Locator;
  readonly phoneInput: Locator;
  readonly addressTextarea: Locator;
  readonly placeOrderButton: Locator;
  readonly thankYouMessage: Locator;
  readonly orderSummaryItems: Locator;
  readonly totalText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shopInput = page.locator('input[name="shop"]');
    this.ownerInput = page.locator('input[name="owner"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.addressTextarea = page.locator('textarea[name="address"]');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order via WhatsApp' });
    this.thankYouMessage = page.getByRole('heading', { name: 'Thank you for shopping with ZiaraKart!' });
    this.orderSummaryItems = page.locator('ul.divide-y li');
    this.totalText = page.locator('div.border-t span.text-gray-700, div.border-t:has-text("Total")');
  }

  /**
   * Navigate directly to /checkout (or via cart flow).
   */
  async navigate() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Fill delivery details form.
   */
  async fillDeliveryDetails(details: CustomerOrderDetails) {
    await this.shopInput.fill(details.shopName);
    await this.ownerInput.fill(details.ownerName);
    await this.phoneInput.fill(details.phone);
    await this.addressTextarea.fill(details.address);
  }

  /**
   * Submit the order and intercept the window.open call to verify WhatsApp message URL.
   */
  async submitOrderAndInterceptWhatsApp(): Promise<string> {
    // Intercept window.open in the browser
    await this.page.evaluate(() => {
      const win = window as any;
      win._interceptedWhatsAppUrl = '';
      win.open = (url: string) => {
        win._interceptedWhatsAppUrl = url;
        return null;
      };
    });

    await this.placeOrderButton.click();

    // Verify thank you message appears
    await expect(this.thankYouMessage).toBeVisible({ timeout: 10000 });

    // Retrieve the intercepted URL
    const interceptedUrl = await this.page.evaluate(() => (window as any)._interceptedWhatsAppUrl);
    return interceptedUrl;
  }
}
