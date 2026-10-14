import { query } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { calculateTotals } from '../../utils/pricing.js';

export async function getCart(userId) {
  const items = await query(
    `SELECT ci.product_id, ci.quantity, p.name, p.slug, p.price, p.image_url, p.stock
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at`,
    [userId],
  );
  return { items, ...calculateTotals(items) };
}

async function getAvailableStock(productId) {
  const [product] = await query('SELECT name, stock FROM products WHERE id = $1', [productId]);
  if (!product) throw ApiError.notFound('Product not found');
  if (product.stock === 0) throw ApiError.conflict(`${product.name} is out of stock`);
  return product.stock;
}

/** Adds a product to the cart, increasing the quantity if present (capped at available stock). */
export async function addItem(userId, { productId, quantity }) {
  const stock = await getAvailableStock(productId);

  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, LEAST($3::int, $4::int))
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, $4::int)`,
    [userId, productId, quantity, stock],
  );
  return getCart(userId);
}

export async function setItemQuantity(userId, productId, quantity) {
  const stock = await getAvailableStock(productId);
  if (quantity > stock) throw ApiError.conflict(`Only ${stock} left in stock`);

  const [item] = await query(
    'UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING product_id',
    [userId, productId, quantity],
  );
  if (!item) throw ApiError.notFound('This product is not in your cart');
  return getCart(userId);
}

export async function removeItem(userId, productId) {
  await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  return getCart(userId);
}

export async function clearCart(userId) {
  await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}

/** Merges a guest (browser) cart into the user's saved cart. Unknown or sold-out products are skipped. */
export async function mergeCart(userId, items) {
  const quantities = new Map();
  for (const { productId, quantity } of items) {
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }

  if (quantities.size > 0) {
    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       SELECT $1::int, p.id, LEAST(guest.quantity, p.stock)
       FROM UNNEST($2::int[], $3::int[]) AS guest(product_id, quantity)
       JOIN products p ON p.id = guest.product_id
       WHERE p.stock > 0
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = LEAST(
         cart_items.quantity + EXCLUDED.quantity,
         (SELECT stock FROM products WHERE id = EXCLUDED.product_id)
       )`,
      [userId, [...quantities.keys()], [...quantities.values()]],
    );
  }
  return getCart(userId);
}
