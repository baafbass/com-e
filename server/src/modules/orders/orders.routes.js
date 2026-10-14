import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/commonSchemas.js';
import * as ordersController from './orders.controller.js';
import { checkoutBody, listOrdersQuery, statusBody } from './orders.schemas.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(checkoutBody), ordersController.checkout);
router.get('/mine', ordersController.listMine);
router.get('/:id', validate(idParam, 'params'), ordersController.getById);
router.patch('/:id/cancel', validate(idParam, 'params'), ordersController.cancel);

router.get('/', authorize('admin'), validate(listOrdersQuery, 'query'), ordersController.listAll);
router.patch(
  '/:id/status',
  authorize('admin'),
  validate(idParam, 'params'),
  validate(statusBody),
  ordersController.updateStatus,
);

export default router;
