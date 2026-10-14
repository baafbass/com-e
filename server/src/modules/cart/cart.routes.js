import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as cartController from './cart.controller.js';

const productId = z.coerce.number().int().positive();
const quantity = z.coerce.number().int().min(1, 'Quantity must be at least 1').max(99);

const productIdParam = z.object({ productId });
const addItemBody = z.object({ productId, quantity: quantity.default(1) });
const updateItemBody = z.object({ quantity });
const mergeBody = z.object({ items: z.array(z.object({ productId, quantity })).max(100) });

const router = Router();

router.use(authenticate);

router.get('/', cartController.get);
router.delete('/', cartController.clear);
router.post('/merge', validate(mergeBody), cartController.merge);
router.post('/items', validate(addItemBody), cartController.addItem);
router.patch('/items/:productId', validate(productIdParam, 'params'), validate(updateItemBody), cartController.updateItem);
router.delete('/items/:productId', validate(productIdParam, 'params'), cartController.removeItem);

export default router;
