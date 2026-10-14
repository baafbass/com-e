import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { useAsync } from '../../hooks/useAsync';
import { ORDER_STATUSES } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';
import { capitalize, formatDate, formatPrice } from '../../utils/format';

const STATUS_TABS = ['', ...ORDER_STATUSES];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error, reload, setData } = useAsync(
    () => ordersApi.listAll({ status: status || undefined, page }),
    [status, page],
  );

  const selectTab = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const changeStatus = async (order, nextStatus) => {
    try {
      const updated = await ordersApi.updateStatus(order.id, nextStatus);
      setData((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === order.id ? { ...item, status: updated.status } : item)),
      }));
      toast.success(`Order #${order.id} marked as ${nextStatus}`);
    } catch (statusError) {
      toast.error(getErrorMessage(statusError));
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{data?.pagination.total ?? 0} orders</p>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Filter orders by status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab || 'all'}
            type="button"
            role="tab"
            id={`orders-tab-${tab || 'all'}`}
            aria-selected={status === tab}
            className={`tabs__tab ${status === tab ? 'tabs__tab--active' : ''}`}
            onClick={() => selectTab(tab)}
          >
            {tab ? capitalize(tab) : 'All'}
          </button>
        ))}
      </div>

      <div className="card">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {data && !isLoading && (
          <>
            <div className="table-wrapper">
              <table className="table" id="admin-orders-table">
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Items</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="table__empty">
                        No orders found.
                      </td>
                    </tr>
                  )}
                  {data.items.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <p className="muted table__description">{order.customerEmail}</p>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.itemCount}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <label htmlFor={`order-status-${order.id}`} className="visually-hidden">
                          Status of order {order.id}
                        </label>
                        <select
                          id={`order-status-${order.id}`}
                          name="status"
                          className={`input select status-select status-select--${order.status}`}
                          value={order.status}
                          disabled={order.status === 'cancelled'}
                          onChange={(event) => changeStatus(order, event.target.value)}
                        >
                          {ORDER_STATUSES.map((option) => (
                            <option key={option} value={option}>
                              {capitalize(option)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
