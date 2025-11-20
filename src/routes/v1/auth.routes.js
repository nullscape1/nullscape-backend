import { Router } from 'express';
import * as AuthController from '../../controllers/authController.js';
import { validateBody } from '../../middlewares/validate.js';
import { auth } from '../../middlewares/auth.js';
import { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema } from '../../validators/auth.js';
import { authRateLimiter, formRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

// Auth routes with strict rate limiting
router.post('/register', authRateLimiter, validateBody(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), AuthController.login);
router.post('/refresh', authRateLimiter, validateBody(refreshSchema), AuthController.refresh);
router.post('/forgot-password', formRateLimiter, validateBody(forgotSchema), AuthController.forgotPassword);
router.post('/reset-password', formRateLimiter, validateBody(resetSchema), AuthController.resetPassword);
router.get('/me', auth(), AuthController.me);
router.post('/logout', AuthController.logout);

export default router;


