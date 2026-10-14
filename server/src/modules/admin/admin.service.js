import { query } from '../../config/db.js';

const LOW_STOCK_THRESHOLD = 5;

export async function getDashboardStats() {
  const [[totals], lowStockProducts, recentOrders] = await Promise.all([
    query(
      `SELECT
         (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled') AS revenue,
         (SELECT COUNT(*) FROM orders)                                           AS order_count,
         (SELECT COUNT(*) FROM orders WHERE status = 'pending')                  AS pending_order_count,
         (SELECT COUNT(*) FROM products)                                         AS product_count,
         (SELECT COUNT(*) FROM users WHERE role = 'customer')                    AS customer_count`,
    ),
    query(
      `SELECT id, name, slug, stock, image_url FROM products
       WHERE stock < $1 ORDER BY stock, name LIMIT 10`,
      [LOW_STOCK_THRESHOLD],
    ),
    query(
      `SELECT o.id, o.status, o.total, o.created_at, u.name AS customer_name
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 5`,
    ),
  ]);

  return { ...totals, lowStockProducts, recentOrders };
}
