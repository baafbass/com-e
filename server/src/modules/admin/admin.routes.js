import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.stats);

export default router;
