import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { testData } from '../testdata/ziarakart.data';

test.describe('ZiaraKart Homepage & Navigation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate('/');
    // Handle the initial loading time gracefully
    await homePage.waitForProductsToLoad();
  });

  test('TC01 - Verify page title and brand header metadata', async ({ page }) => {
    await expect(page).toHaveTitle(testData.expectedTitle);
    const brandLink = homePage.homeLink;
    await expect(brandLink).toBeVisible();
    await expect(page.locator('text=ZiaraKart').first()).toBeVisible();
  });

  test('TC02 - Verify all main navigation links are present and functional', async ({ page }) => {
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.aboutUsLink).toBeVisible();
    await expect(homePage.ourProductsLink).toBeVisible();
    await expect(homePage.distributorLink).toBeVisible();

    // Navigate to About Us
    await homePage.aboutUsLink.click();
    await page.waitForURL('**/about');
    expect(page.url()).toContain('/about');

    // Navigate back to Home
    await homePage.homeLink.click();
    await page.waitForURL('**/');
    expect(page.url()).toBe(testData.baseUrl + '/');
  });

  test('TC03 - Verify category filter options are rendered in catalog dropdown', async () => {
    // Dynamic polling until all categories are derived from products
    await expect.poll(async () => (await homePage.getCategoryOptions()).length, { timeout: 15000 }).toBeGreaterThan(2);
    const options = await homePage.getCategoryOptions();
    expect(options).toContain('All');
    expect(options).toContain('Toothbrush');
  });

  test('TC04 - Verify footer links and WhatsApp contact integration', async ({ page }) => {
    const waLink = page.locator(`a[href*="wa.me/${testData.supportWhatsAppNumber}"]`).first();
    await expect(waLink).toBeVisible();
    expect(await waLink.getAttribute('href')).toContain(testData.supportWhatsAppNumber);

    const privacyLink = page.locator('footer a:has-text("Privacy Policy")');
    await expect(privacyLink).toBeVisible();
  });
});
