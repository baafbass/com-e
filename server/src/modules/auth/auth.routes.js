import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { authRateLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import * as authController from './auth.controller.js';
import { changePasswordBody, loginBody, registerBody, updateProfileBody } from './auth.schemas.js';

const router = Router();

router.post('/register', authRateLimiter, validate(registerBody), authController.register);
router.post('/login', authRateLimiter, validate(loginBody), authController.login);

router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, validate(updateProfileBody), authController.updateProfile);
router.patch('/me/password', authenticate, validate(changePasswordBody), authController.changePassword);

export default router;
