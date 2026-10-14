import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/commonSchemas.js';
import * as usersController from './users.controller.js';

const roleBody = z.object({ role: z.enum(['customer', 'admin']) });

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', usersController.list);
router.patch('/:id/role', validate(idParam, 'params'), validate(roleBody), usersController.updateRole);

export default router;
