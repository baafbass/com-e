import { AlertTriangle, Clock, DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import StatCard from '../../components/admin/StatCard';
import ProductImage from '../../components/product/ProductImage';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Spinner from '../../components/ui/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, formatPrice } from '../../utils/format';

export default function DashboardPage() {
  const { data: stats, isLoading, error, reload } = useAsync(() => adminApi.stats(), []);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">An overview of your store&apos;s performance.</p>
        </div>
      </header>

      <section className="stat-grid" aria-label="Key metrics">
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue)} tone="success" />
        <StatCard icon={ShoppingBag} label="Orders" value={stats.orderCount} />
        <StatCard icon={Clock} label="Pending orders" value={stats.pendingOrderCount} tone="warning" />
        <StatCard icon={Package} label="Products" value={stats.productCount} tone="info" />
        <StatCard icon={Users} label="Customers" value={stats.customerCount} tone="purple" />
      </section>

      <div className="admin-grid">
        <section className="card" aria-labelledby="recent-orders-title">
          <header className="card__header">
            <h2 id="recent-orders-title" className="card__title">
              Recent orders
            </h2>
            <Link to="/admin/orders" className="link-arrow">
              View all
            </Link>
          </header>
          {stats.recentOrders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                      </td>
                      <td>{order.customerName}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card" aria-labelledby="low-stock-title">
          <header className="card__header">
            <h2 id="low-stock-title" className="card__title">
              <AlertTriangle size={18} aria-hidden="true" className="text-warning" /> Low stock
            </h2>
            <Link to="/admin/products" className="link-arrow">
              Manage
            </Link>
          </header>
          {stats.lowStockProducts.length === 0 ? (
            <p className="muted">All products are well stocked.</p>
          ) : (
            <ul className="low-stock-list">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="low-stock-list__item">
                  <ProductImage src={product.imageUrl} alt="" className="low-stock-list__image" />
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  <span className={`badge ${product.stock === 0 ? 'badge--cancelled' : 'badge--pending'}`}>
                    {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
