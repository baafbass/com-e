import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(255);

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a number');

const name = z.string().trim().min(2, 'Name must be at least 2 characters').max(100);

export const registerBody = z.object({ name, email, password });

export const loginBody = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileBody = z.object({ name, email });

export const changePasswordBody = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password,
});
