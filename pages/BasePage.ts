import { Page, Locator, expect } from '@playwright/test';
import { headerLocators } from '../locators/header.locators';

export class BasePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly cartButton: Locator;
  readonly homeLink: Locator;
  readonly aboutUsLink: Locator;
  readonly ourProductsLink: Locator;
  readonly distributorLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator(headerLocators.searchInput);
    this.cartButton = page.locator(headerLocators.cartButton);
    this.homeLink = page.locator(headerLocators.homeLink).first();
    this.aboutUsLink = page.locator(headerLocators.aboutUsLink).first();
    this.ourProductsLink = page.locator(headerLocators.ourProductsLink).first();
    this.distributorLink = page.locator(headerLocators.distributorLink).first();
  }

  /**
   * Navigate to a path and wait for React to hydrate and products to mount.
   */
  async navigate(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('#root', { state: 'attached' });
  }

  /**
   * Waits for the product catalog to completely finish loading and rendering.
   * Handles client-side API streaming and dynamic product population.
   */
  async waitForProductsToLoad(timeout: number = 25000) {
    // Wait for initial cards to be visible
    await this.page.locator('div.bg-white.rounded-2xl.shadow').first().waitFor({
      state: 'visible',
      timeout,
    });
    // Wait until 'Showing X of Y products' is visible and stable
    const showingText = this.page.locator('text=/Showing \\d+ of \\d+ products/i');
    await showingText.waitFor({ state: 'visible', timeout }).catch(() => {});
    // Give brief settle time for all card components to finish rendering
    await this.page.waitForTimeout(500);
  }

  /**
   * Sets up verified dealer access state in localStorage and mocks approval response.
   */
  async setupDealerAccess(token: string = 'test-qa-dealer-token', shop: string = 'QA Mart', owner: string = 'QA Lead') {
    // Intercept Google Apps Script auth check so it always approves in test environment
    await this.page.route('**/macros/s/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, status: 'Approved' }),
      });
    });

    // Inject dealer credentials before page scripts run
    await this.page.addInitScript(({ t, s, o }) => {
      localStorage.setItem('dealerToken', t);
      localStorage.setItem('dealerShop', s);
      localStorage.setItem('dealerOwner', o);
    }, { t: token, s: shop, o: owner });
  }

  /**
   * Search for a term using the global header search input.
   */
  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(400);
  }

  /**
   * Clear the search input.
   */
  async clearSearch() {
    await this.searchInput.fill('');
    await this.page.waitForTimeout(400);
  }

  /**
   * Get the current count displayed on the header Cart button (e.g. "🛒 Cart (2)" -> 2).
   */
  async getCartCount(): Promise<number> {
    const text = await this.cartButton.innerText();
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Open the slide-over cart drawer.
   */
  async openCart() {
    await this.cartButton.click({ noWaitAfter: true });
    await this.page.locator('aside.translate-x-0').waitFor({ state: 'visible', timeout: 10000 });
  }
}
