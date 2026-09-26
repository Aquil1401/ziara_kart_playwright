export const checkoutLocators = {
  pageHeading: 'h1:has-text("Checkout"), h2:has-text("Order")',
  shopInput: 'input[name="shop"]',
  ownerInput: 'input[name="owner"]',
  phoneInput: 'input[name="phone"]',
  addressInput: 'textarea[name="address"], input[name="address"]',
  placeOrderButton: 'button:has-text("Place Order on WhatsApp"), button[type="submit"]',
  orderSummaryItems: 'div:has-text("Order Summary")',
  totalPriceDisplay: 'text=/Total Amount.*₹\\d+/i',
};
