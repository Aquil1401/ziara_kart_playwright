export const cartLocators = {
  cartDrawer: 'div:has-text("Your Cart")',
  closeButton: 'button:has-text("✕")',
  emptyCartText: 'text=Cart is empty',
  cartItemRow: 'div.flex.items-center.justify-between.py-2, div.flex.items-center.gap-3',
  cartItemName: 'p.font-medium, span.font-medium',
  totalAmountText: 'div:has-text("Total") span.text-emerald-700, span:has-text("₹")',
  proceedOrderButton: 'button:has-text("Proceed for Order")',
};
