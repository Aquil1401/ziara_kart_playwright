import { Page, Locator, expect } from '@playwright/test';

export interface DealerRequestData {
  shopName: string;
  ownerName: string;
  phone: string;
  email?: string;
  city?: string;
  gst?: string;
}

export class DealerModal {
  readonly page: Page;
  readonly shopNameInput: Locator;
  readonly ownerNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly cityInput: Locator;
  readonly gstInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shopNameInput = page.locator('input[name="shopName"]');
    this.ownerNameInput = page.locator('input[name="ownerName"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.emailInput = page.locator('input[name="email"]');
    this.cityInput = page.locator('input[name="city"]');
    this.gstInput = page.locator('input[name="gst"]');
    this.submitButton = page.getByRole('button', { name: 'Submit Request' });
  }

  /**
   * Verify that the modal is visible.
   */
  async isModalOpen(): Promise<boolean> {
    return await this.shopNameInput.isVisible({ timeout: 5000 });
  }

  /**
   * Fill out the form fields.
   */
  async fillForm(data: DealerRequestData) {
    if (data.shopName !== undefined) await this.shopNameInput.fill(data.shopName);
    if (data.ownerName !== undefined) await this.ownerNameInput.fill(data.ownerName);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.gst !== undefined) await this.gstInput.fill(data.gst);
  }

  /**
   * Click submit button.
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Close the modal by clicking outside overlay or pressing Escape.
   */
  async close() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  /**
   * Get all visible validation error texts.
   */
  async getValidationErrors(): Promise<string[]> {
    const errorLocators = this.page.locator('p.text-red-500');
    const count = await errorLocators.count();
    const errors: string[] = [];
    for (let i = 0; i < count; i++) {
      const txt = await errorLocators.nth(i).innerText();
      if (txt.trim()) errors.push(txt.trim());
    }
    return errors;
  }
}
