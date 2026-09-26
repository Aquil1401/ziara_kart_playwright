import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DealerModal } from '../pages/DealerModal';
import { testData } from '../testdata/ziarakart.data';

test.describe('ZiaraKart Guest Mode & Dealer Request Access Modal', () => {
  let homePage: HomePage;
  let dealerModal: DealerModal;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    dealerModal = new DealerModal(page);
    await homePage.navigate('/');
    await homePage.waitForProductsToLoad();
  });

  test('TC09 - Guest users see blurred wholesale prices and Request Access CTA', async () => {
    const areBlurred = await homePage.arePricesBlurred();
    expect(areBlurred).toBe(true);

    const firstCard = homePage.productCards.first();
    const reqBtn = firstCard.locator('button:has-text("Request Access")');
    await expect(reqBtn).toBeVisible();
  });

  test('TC10 - Clicking Request Access opens dealer verification modal', async () => {
    await homePage.clickRequestAccess();
    const isOpen = await dealerModal.isModalOpen();
    expect(isOpen).toBe(true);
    await expect(dealerModal.shopNameInput).toBeVisible();
    await expect(dealerModal.phoneInput).toBeVisible();
    await dealerModal.close();
  });

  test('TC11 - Dealer modal validates required fields and invalid formats', async ({ page }) => {
    await homePage.clickRequestAccess();
    await expect(dealerModal.shopNameInput).toBeVisible();

    // Fill invalid phone (less than 10 digits) and invalid email
    await dealerModal.fillForm({
      shopName: '',
      ownerName: '',
      phone: testData.guestDealerForm.invalidPhone,
      email: testData.guestDealerForm.invalidEmail,
    });

    await dealerModal.submit();

    // Verify validation errors appear on the page
    const errors = await dealerModal.getValidationErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('10-digit') || e.includes('phone') || e.includes('numbers'))).toBe(true);
    expect(errors.some(e => e.includes('Invalid email') || e.includes('email'))).toBe(true);

    // Close modal
    await dealerModal.close();
  });
});
