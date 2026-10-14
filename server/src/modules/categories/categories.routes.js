import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam, optionalUrl } from '../../utils/commonSchemas.js';
import * as categoriesController from './categories.controller.js';

const categoryBody = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).default(''),
  imageUrl: optionalUrl,
});

const adminOnly = [authenticate, authorize('admin')];

const router = Router();

router.get('/', categoriesController.list);
router.post('/', adminOnly, validate(categoryBody), categoriesController.create);
router.put('/:id', adminOnly, validate(idParam, 'params'), validate(categoryBody), categoriesController.update);
router.delete('/:id', adminOnly, validate(idParam, 'params'), categoriesController.remove);

export default router;
