import { ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { formatDate, formatPrice } from '../utils/format';

export default function OrdersPage() {
  const { data: orders, isLoading, error, reload } = useAsync(() => ordersApi.listMine(), []);

  return (
    <div className="container page page--narrow">
      <header className="page-header">
        <h1 className="page-title">My orders</h1>
        <p className="page-subtitle">Track and manage your purchases.</p>
      </header>

      {isLoading && <Spinner />}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {orders?.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="When you place an order, it will appear here."
          action={
            <Link to="/shop" className="btn btn--primary">
              Start shopping
            </Link>
          }
        />
      )}

      {orders?.length > 0 && (
        <ul className="order-list" id="order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="order-row card" id={`order-${order.id}`}>
                <div>
                  <p className="order-row__id">Order #{order.id}</p>
                  <p className="muted">
                    <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time> · {order.itemCount} items
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <p className="order-row__total">{formatPrice(order.total)}</p>
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
