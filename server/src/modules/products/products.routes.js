import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/commonSchemas.js';
import reviewsRoutes from '../reviews/reviews.routes.js';
import * as productsController from './products.controller.js';
import { listProductsQuery, productBody, slugParam } from './products.schemas.js';

const adminOnly = [authenticate, authorize('admin')];

const router = Router();

router.get('/', validate(listProductsQuery, 'query'), productsController.list);
router.get('/:slug', validate(slugParam, 'params'), productsController.getBySlug);

router.post('/', adminOnly, validate(productBody), productsController.create);
router.put('/:id', adminOnly, validate(idParam, 'params'), validate(productBody), productsController.update);
router.delete('/:id', adminOnly, validate(idParam, 'params'), productsController.remove);

router.use('/:id/reviews', reviewsRoutes);

export default router;
