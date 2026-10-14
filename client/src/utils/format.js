import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './constants';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export const formatPrice = (amount) => currencyFormatter.format(amount ?? 0);

export const formatDate = (value) => dateFormatter.format(new Date(value));

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const roundMoney = (amount) => Math.round(amount * 100) / 100;

/** Same pricing rule as the API, used to show totals for guest carts. */
export function calculateTotals(items) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return { itemCount, subtotal, shippingFee, total: roundMoney(subtotal + shippingFee) };
}
