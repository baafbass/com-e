import { query, withTransaction } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPagination, toOffset } from '../../utils/pagination.js';
import { calculateTotals } from '../../utils/pricing.js';

const ORDER_SUMMARY_SELECT = `
  SELECT o.id, o.status, o.total, o.created_at, u.name AS customer_name, u.email AS customer_email,
         (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE order_id = o.id) AS item_count
  FROM orders o
  JOIN users u ON u.id = o.user_id`;

async function findOrder(orderId, run = query) {
  const [order] = await run(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'productId', oi.product_id,
                  'productName', oi.product_name,
                  'productImage', oi.product_image,
                  'unitPrice', oi.unit_price,
                  'quantity', oi.quantity
                ) ORDER BY oi.id
              ) FILTER (WHERE oi.id IS NOT NULL),
              '[]'
            ) AS items
     FROM orders o
     JOIN users u ON u.id = o.user_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1
     GROUP BY o.id, u.id`,
    [orderId],
  );
  return order ?? null;
}

const restoreStock = (run, orderId) =>
  run(
    `UPDATE products p
     SET stock = p.stock + oi.quantity, updated_at = NOW()
     FROM order_items oi
     WHERE oi.order_id = $1 AND p.id = oi.product_id`,
    [orderId],
  );

/** Turns the user's cart into an order. Stock is locked, checked and decremented atomically. */
export function checkout(userId, shipping) {
  return withTransaction(async (run) => {
    const items = await run(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock, p.image_url
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       ORDER BY p.id
       FOR UPDATE OF p`,
      [userId],
    );

    if (items.length === 0) throw ApiError.badRequest('Your cart is empty');

    const unavailable = items.find((item) => item.quantity > item.stock);
    if (unavailable) throw ApiError.conflict(`Not enough stock for ${unavailable.name}`);

    const { subtotal, shippingFee, total } = calculateTotals(items);

    const [{ id: orderId }] = await run(
      `INSERT INTO orders
         (user_id, subtotal, shipping_fee, total, shipping_name, phone, address, city, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        userId,
        subtotal,
        shippingFee,
        total,
        shipping.shippingName,
        shipping.phone,
        shipping.address,
        shipping.city,
        shipping.postalCode,
        shipping.country,
      ],
    );

    const column = (key) => items.map((item) => item[key]);

    await run(
      `INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity)
       SELECT $1::int, * FROM UNNEST($2::int[], $3::text[], $4::text[], $5::numeric[], $6::int[])`,
      [orderId, column('productId'), column('name'), column('imageUrl'), column('price'), column('quantity')],
    );

    await run(
      `UPDATE products p
       SET stock = p.stock - purchased.quantity, updated_at = NOW()
       FROM UNNEST($1::int[], $2::int[]) AS purchased(product_id, quantity)
       WHERE p.id = purchased.product_id`,
      [column('productId'), column('quantity')],
    );

    await run('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    return findOrder(orderId, run);
  });
}

export function listUserOrders(userId) {
  return query(`${ORDER_SUMMARY_SELECT} WHERE o.user_id = $1 ORDER BY o.created_at DESC`, [userId]);
}

/** Returns an order visible to the given user: their own, or any order for admins. */
export async function getOrderForUser(orderId, user) {
  const order = await findOrder(orderId);
  const canView = order && (user.role === 'admin' || order.userId === user.id);
  if (!canView) throw ApiError.notFound('Order not found');
  return order;
}

export function cancelOrder(orderId, userId) {
  return withTransaction(async (run) => {
    const [order] = await run('SELECT status FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE', [
      orderId,
      userId,
    ]);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.status !== 'pending') throw ApiError.conflict('Only pending orders can be cancelled');

    await run(`UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`, [orderId]);
    await restoreStock(run, orderId);
    return findOrder(orderId, run);
  });
}

export async function listAllOrders(filters) {
  const where = filters.status ? 'WHERE o.status = $1' : '';
  const params = filters.status ? [filters.status] : [];
  const limitIndex = params.length + 1;

  const [items, [{ total }]] = await Promise.all([
    query(`${ORDER_SUMMARY_SELECT} ${where} ORDER BY o.created_at DESC LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`, [
      ...params,
      filters.limit,
      toOffset(filters),
    ]),
    query(`SELECT COUNT(*) AS total FROM orders o ${where}`, params),
  ]);

  return { items, pagination: buildPagination(filters, total) };
}

export function updateOrderStatus(orderId, status) {
  return withTransaction(async (run) => {
    const [order] = await run('SELECT status FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.status === 'cancelled') throw ApiError.conflict('Cancelled orders cannot be changed');

    await run('UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1', [orderId, status]);
    if (status === 'cancelled') await restoreStock(run, orderId);
    return findOrder(orderId, run);
  });
}
