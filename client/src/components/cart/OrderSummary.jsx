import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';
import { formatPrice } from '../../utils/format';

/** Totals card shared by the cart, checkout and order pages. */
export default function OrderSummary({ subtotal, shippingFee, total, itemCount, showProgress = false, children }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <aside className="summary card" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="summary__title">
        Order summary
      </h2>

      {showProgress && (
        <div className="shipping-progress">
          <p>
            {remaining > 0 ? (
              <>
                Add <strong>{formatPrice(remaining)}</strong> more for free shipping
              </>
            ) : (
              <strong>You&apos;ve unlocked free shipping!</strong>
            )}
          </p>
          <progress
            id="free-shipping-progress"
            className="shipping-progress__bar"
            max={100}
            value={progress}
            aria-label="Progress toward free shipping"
          />
        </div>
      )}

      <dl className="summary__rows">
        <div className="summary__row">
          <dt>Subtotal{itemCount !== undefined && ` (${itemCount} items)`}</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="summary__row">
          <dt>Shipping</dt>
          <dd>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</dd>
        </div>
        <div className="summary__row summary__row--total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}
