import { CheckCircle2, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ordersApi } from '../api';
import OrderSummary from '../components/cart/OrderSummary';
import ProductImage from '../components/product/ProductImage';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { capitalize, formatDate, formatPrice } from '../utils/format';
import { getErrorMessage } from '../utils/errors';

const PROGRESS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderProgress({ status }) {
  if (status === 'cancelled') return <p className="alert alert--error">This order was cancelled.</p>;

  const currentIndex = PROGRESS_STEPS.indexOf(status);

  return (
    <ol className="order-progress" aria-label="Order progress">
      {PROGRESS_STEPS.map((step, index) => (
        <li
          key={step}
          className={`order-progress__step ${index <= currentIndex ? 'order-progress__step--done' : ''}`}
          aria-current={index === currentIndex ? 'step' : undefined}
        >
          <span className="order-progress__dot" aria-hidden="true" />
          {capitalize(step)}
        </li>
      ))}
    </ol>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { data: order, isLoading, error, reload, setData } = useAsync(() => ordersApi.getById(id), [id]);

  if (isLoading && !order) return <Spinner fullPage />;
  if (error) {
    return (
      <div className="container page">
        <ErrorMessage message={error} onRetry={reload} />
      </div>
    );
  }

  const cancelOrder = async () => {
    try {
      setData(await ordersApi.cancel(order.id));
      toast.success('Order cancelled');
    } catch (cancelError) {
      toast.error(getErrorMessage(cancelError));
    }
  };

  return (
    <div className="container page">
      {location.state?.justPlaced && (
        <div className="alert alert--success" role="status">
          <CheckCircle2 size={20} aria-hidden="true" />
          <span>Thank you! Your order has been placed and is now being prepared.</span>
        </div>
      )}

      <header className="page-header page-header--row">
        <div>
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link to="/orders">My orders</Link> <span aria-hidden="true">/</span>{' '}
            <span aria-current="page">Order #{order.id}</span>
          </nav>
          <h1 className="page-title">Order #{order.id}</h1>
          <p className="page-subtitle">
            Placed on <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <OrderProgress status={order.status} />

      <div className="two-column">
        <div className="stack">
          <section className="card" aria-labelledby="order-items-title">
            <h2 id="order-items-title" className="card__title">
              Items
            </h2>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.id} className="order-item">
                  <ProductImage src={item.productImage} alt="" className="order-item__image" />
                  <div className="order-item__info">
                    <strong>{item.productName}</strong>
                    <span className="muted">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </span>
                  </div>
                  <span className="order-item__total">{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="shipping-title">
            <h2 id="shipping-title" className="card__title">
              Shipping address
            </h2>
            <address className="address">
              <strong>{order.shippingName}</strong>
              <span>
                <MapPin size={16} aria-hidden="true" /> {order.address}, {order.city} {order.postalCode}, {order.country}
              </span>
              <span>
                <Phone size={16} aria-hidden="true" /> {order.phone}
              </span>
            </address>
          </section>
        </div>

        <OrderSummary subtotal={order.subtotal} shippingFee={order.shippingFee} total={order.total}>
          {order.status === 'pending' && (
            <button
              type="button"
              id="cancel-order"
              className="btn btn--outline-danger btn--block"
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel order
            </button>
          )}
        </OrderSummary>
      </div>

      <ConfirmDialog
        isOpen={isCancelOpen}
        title="Cancel this order?"
        message="The items will be returned to stock. This cannot be undone."
        confirmLabel="Cancel order"
        onConfirm={cancelOrder}
        onClose={() => setIsCancelOpen(false)}
      />
    </div>
  );
}
