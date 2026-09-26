import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { productsLocators } from '../locators/products.locators';

export class HomePage extends BasePage {
  readonly productCards: Locator;
  readonly categorySelect: Locator;
  readonly showingCountText: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator(productsLocators.productCard);
    this.categorySelect = page.locator('select');
    this.showingCountText = page.locator(productsLocators.showingProductsCountText);
  }

  /**
   * Select a category from the dropdown (e.g., 'Toothbrush', 'Home Cleaning', 'All').
   */
  async selectCategory(categoryName: string) {
    await this.categorySelect.waitFor({ state: 'visible', timeout: 10000 });
    await this.categorySelect.selectOption(categoryName);
    // Debounce wait for state update
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all category option labels from the select dropdown.
   */
  async getCategoryOptions(): Promise<string[]> {
    return await this.categorySelect.locator('option').allInnerTexts();
  }

  /**
   * Get the total count of currently visible product cards.
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get all visible product titles.
   */
  async getVisibleProductTitles(): Promise<string[]> {
    const count = await this.productCards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await this.productCards.nth(i).locator(productsLocators.productTitle).innerText();
      titles.push(title.trim());
    }
    return titles;
  }

  /**
   * Finds a product card locator by title substring.
   */
  getProductCardByName(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  /**
   * Click "Request Access" button on a product (Guest mode).
   */
  async clickRequestAccess(productName?: string) {
    const card = productName ? this.getProductCardByName(productName) : this.productCards.first();
    const btn = card.locator(productsLocators.requestAccessButton);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await this.page.locator('input[name="shopName"]').waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click "Add" button to add a product to cart (Dealer mode).
   */
  async addProductToCart(productName: string) {
    const card = this.getProductCardByName(productName);
    const addBtn = card.locator(productsLocators.addButton);
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn.click({ noWaitAfter: true });
  }

  /**
   * Increment product quantity inside product card (+ button).
   */
  async incrementProductQuantity(productName: string) {
    const card = this.getProductCardByName(productName);
    const incBtn = card.locator(productsLocators.incrementButton);
    await incBtn.scrollIntoViewIfNeeded();
    await incBtn.click({ noWaitAfter: true });
  }

  /**
   * Decrement product quantity inside product card (− button).
   */
  async decrementProductQuantity(productName: string) {
    const card = this.getProductCardByName(productName);
    const decBtn = card.locator(productsLocators.decrementButton);
    await decBtn.scrollIntoViewIfNeeded();
    await decBtn.click({ noWaitAfter: true });
  }

  /**
   * Read quantity number displayed on product card.
   */
  async getCardQuantity(productName: string): Promise<number> {
    const card = this.getProductCardByName(productName);
    const qtyText = await card.locator(productsLocators.quantityText).innerText();
    return parseInt(qtyText.trim(), 10);
  }

  /**
   * Check if prices are blurred (Guest mode verification).
   */
  async arePricesBlurred(): Promise<boolean> {
    const blurredCount = await this.page.locator(productsLocators.blurredPrice).count();
    return blurredCount > 0;
  }
}
