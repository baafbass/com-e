import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { pool, query } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { categories, demoCustomer, demoReviews, products } from './seed-data.js';

const SALT_ROUNDS = 10;

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [user] = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
     RETURNING id`,
    [name, email.toLowerCase(), passwordHash, role],
  );
  return user.id;
}

async function seedCategories() {
  for (const category of categories) {
    await query(
      `INSERT INTO categories (name, slug, description, image_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING`,
      [category.name, slugify(category.name), category.description, category.imageUrl],
    );
  }
}

async function seedProducts() {
  for (const product of products) {
    await query(
      `INSERT INTO products
         (name, slug, description, price, compare_at_price, stock, image_url, is_featured, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM categories WHERE slug = $9))
       ON CONFLICT (slug) DO NOTHING`,
      [
        product.name,
        slugify(product.name),
        product.description,
        product.price,
        product.compareAtPrice ?? null,
        product.stock,
        product.imageUrl,
        product.isFeatured ?? false,
        product.category,
      ],
    );
  }
}

async function seedReviews(userId) {
  for (const review of demoReviews) {
    await query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       SELECT id, $2, $3, $4 FROM products WHERE slug = $1
       ON CONFLICT (product_id, user_id) DO NOTHING`,
      [review.product, userId, review.rating, review.comment],
    );
  }
}

async function seed() {
  await upsertUser({ name: 'Store Admin', email: env.adminEmail, password: env.adminPassword, role: 'admin' });
  const customerId = await upsertUser({ ...demoCustomer, role: 'customer' });
  await seedCategories();
  await seedProducts();
  await seedReviews(customerId);

  console.log('Seed completed.');
  console.log(`  Admin:    ${env.adminEmail} / ${env.adminPassword}`);
  console.log(`  Customer: ${demoCustomer.email} / ${demoCustomer.password}`);
}

seed()
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
