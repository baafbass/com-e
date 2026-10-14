import rateLimit from 'express-rate-limit';

/** Limits brute-force attempts on login and registration. */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again in 15 minutes' },
});
