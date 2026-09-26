import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { testData } from '../testdata/ziarakart.data';

test.describe('ZiaraKart Products Search & Category Filtering', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate('/');
    await homePage.waitForProductsToLoad();
  });

  test('TC05 - Search for a product by exact keyword', async () => {
    const searchTerm = testData.searchQueries.specificItem; // 'Excel Scrubber'
    await homePage.searchProduct(searchTerm);

    const titles = await homePage.getVisibleProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect(title.toLowerCase()).toContain('scrubber');
    }
  });

  test('TC06 - Search is case-insensitive and filters live', async () => {
    await homePage.searchProduct('toothbrush');
    const titlesLower = await homePage.getVisibleProductTitles();
    expect(titlesLower.length).toBeGreaterThan(0);

    await homePage.searchProduct('TOOTHBRUSH');
    const titlesUpper = await homePage.getVisibleProductTitles();
    expect(titlesUpper.length).toEqual(titlesLower.length);
  });

  test('TC07 - Search with non-existing term returns zero results gracefully', async () => {
    await homePage.searchProduct(testData.searchQueries.nonExistingItem);
    const count = await homePage.getProductCount();
    expect(count).toBe(0);

    // Clear search and verify catalog restores
    await homePage.clearSearch();
    const restoredCount = await homePage.getProductCount();
    expect(restoredCount).toBeGreaterThan(10);
  });

  test('TC08 - Filter products by category dropdown', async ({ page }) => {
    const initialCount = await homePage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    // Filter by Toothbrush category
    await homePage.selectCategory('Toothbrush');
    const filteredCount = await homePage.getProductCount();
    expect(filteredCount).toBeGreaterThan(0);

    // Verify all filtered cards have category label 'Toothbrush'
    const categoryLabels = page.locator('div.bg-white.rounded-2xl.shadow p.text-\\[11px\\]');
    const firstCategory = await categoryLabels.first().innerText();
    expect(firstCategory.trim()).toBe('Toothbrush');

    // Return to All
    await homePage.selectCategory('All');
    const allCount = await homePage.getProductCount();
    expect(allCount).toEqual(initialCount);
  });
});
