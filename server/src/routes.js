import { Router } from 'express';
import adminRoutes from './modules/admin/admin.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import usersRoutes from './modules/users/users.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

export default router;
