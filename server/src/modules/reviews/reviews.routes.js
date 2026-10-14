import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/commonSchemas.js';
import * as reviewsController from './reviews.controller.js';

const reviewBody = z.object({
  rating: z.coerce.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
  comment: z.string().trim().max(1000).default(''),
});

// Mounted at /products/:id/reviews
const router = Router({ mergeParams: true });

router.use(validate(idParam, 'params'));

router.get('/', reviewsController.list);
router.post('/', authenticate, validate(reviewBody), reviewsController.upsert);

export default router;
