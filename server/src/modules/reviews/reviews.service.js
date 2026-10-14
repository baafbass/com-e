import { query } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export function listReviews(productId) {
  return query(
    `SELECT r.id, r.rating, r.comment, r.created_at, r.user_id, u.name AS user_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId],
  );
}

/** Creates the user's review for a product, or replaces it if one already exists. */
export async function upsertReview(productId, userId, { rating, comment }) {
  const [product] = await query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product) throw ApiError.notFound('Product not found');

  const [review] = await query(
    `INSERT INTO reviews (product_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (product_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = NOW()
     RETURNING *`,
    [productId, userId, rating, comment],
  );
  return review;
}
