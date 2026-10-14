import { query } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPagination, toOffset } from '../../utils/pagination.js';
import { slugify } from '../../utils/slugify.js';

const ORDER_BY = {
  newest: 'p.created_at DESC',
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
  name_asc: 'p.name ASC',
  rating: 'rating DESC, review_count DESC',
};

const PRODUCT_SELECT = `
  SELECT p.*,
         c.name AS category_name,
         c.slug AS category_slug,
         COALESCE(r.rating, 0) AS rating,
         COALESCE(r.review_count, 0) AS review_count
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN (
    SELECT product_id, ROUND(AVG(rating), 1) AS rating, COUNT(*) AS review_count
    FROM reviews
    GROUP BY product_id
  ) r ON r.product_id = p.id`;

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

/** Builds a parameterised WHERE clause from the catalog filters. */
function buildFilters({ search, category, minPrice, maxPrice, inStock, featured }) {
  const conditions = [];
  const params = [];

  const addCondition = (clause, value) => {
    params.push(value);
    conditions.push(clause.replaceAll('?', `$${params.length}`));
  };

  if (search) addCondition('(p.name ILIKE ? OR p.description ILIKE ?)', `%${escapeLike(search)}%`);
  if (category) addCondition('c.slug = ?', category);
  if (minPrice !== undefined) addCondition('p.price >= ?', minPrice);
  if (maxPrice !== undefined) addCondition('p.price <= ?', maxPrice);
  if (inStock) conditions.push('p.stock > 0');
  if (featured) conditions.push('p.is_featured = TRUE');

  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

export async function listProducts(filters) {
  const { where, params } = buildFilters(filters);
  const limitIndex = params.length + 1;

  const [items, [{ total }]] = await Promise.all([
    query(
      `${PRODUCT_SELECT} ${where}
       ORDER BY ${ORDER_BY[filters.sort]}, p.id DESC
       LIMIT $${limitIndex} OFFSET $${limitIndex + 1}`,
      [...params, filters.limit, toOffset(filters)],
    ),
    query(
      `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON c.id = p.category_id ${where}`,
      params,
    ),
  ]);

  return { items, pagination: buildPagination(filters, total) };
}

async function findOne(column, value) {
  const [product] = await query(`${PRODUCT_SELECT} WHERE p.${column} = $1`, [value]);
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export const getProductBySlug = (slug) => findOne('slug', slug);

export const getProductById = (id) => findOne('id', id);

const toColumnValues = (product) => [
  product.name,
  slugify(product.name),
  product.description,
  product.price,
  product.compareAtPrice,
  product.stock,
  product.imageUrl,
  product.categoryId,
  product.isFeatured,
];

export async function createProduct(product) {
  const [{ id }] = await query(
    `INSERT INTO products
       (name, slug, description, price, compare_at_price, stock, image_url, category_id, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    toColumnValues(product),
  );
  return getProductById(id);
}

export async function updateProduct(id, product) {
  const [updated] = await query(
    `UPDATE products
     SET name = $2, slug = $3, description = $4, price = $5, compare_at_price = $6,
         stock = $7, image_url = $8, category_id = $9, is_featured = $10, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [id, ...toColumnValues(product)],
  );
  if (!updated) throw ApiError.notFound('Product not found');
  return getProductById(id);
}

export async function deleteProduct(id) {
  const [deleted] = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  if (!deleted) throw ApiError.notFound('Product not found');
}
