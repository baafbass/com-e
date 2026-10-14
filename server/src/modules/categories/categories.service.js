import { query } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { slugify } from '../../utils/slugify.js';

export function listCategories() {
  return query(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name`,
  );
}

export async function createCategory({ name, description, imageUrl }) {
  const [category] = await query(
    `INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, slugify(name), description, imageUrl],
  );
  return category;
}

export async function updateCategory(id, { name, description, imageUrl }) {
  const [category] = await query(
    `UPDATE categories SET name = $2, slug = $3, description = $4, image_url = $5 WHERE id = $1 RETURNING *`,
    [id, name, slugify(name), description, imageUrl],
  );
  if (!category) throw ApiError.notFound('Category not found');
  return category;
}

export async function deleteCategory(id) {
  const [deleted] = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  if (!deleted) throw ApiError.notFound('Category not found');
}
