export const dealerModalLocators = {
  modalContainer: 'div[class*="fixed inset-0"]:has(h2, h3, form)',
  modalTitle: 'text=Request Dealer Access, text=Retailer Verification',
  shopNameInput: 'input[name="shopName"]',
  ownerNameInput: 'input[name="ownerName"]',
  phoneInput: 'input[name="phone"]',
  emailInput: 'input[name="email"]',
  cityInput: 'input[name="city"]',
  gstInput: 'input[name="gst"]',
  fileUploadInput: 'input[type="file"]',
  submitButton: 'button[type="submit"]:has-text("Submit"), button:has-text("Request Access")',
  closeModalButton: 'button:has-text("✕"), button[aria-label="Close"]',
  validationError: 'p.text-red-500, span.text-red-500, div.text-red-500',
};
