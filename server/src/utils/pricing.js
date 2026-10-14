export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 9.99;

const roundMoney = (amount) => Math.round(amount * 100) / 100;

/** Computes cart/order totals from items shaped like `{ price, quantity }`. */
export function calculateTotals(items) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return { itemCount, subtotal, shippingFee, total: roundMoney(subtotal + shippingFee) };
}
