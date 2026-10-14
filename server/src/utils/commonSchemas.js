import { z } from 'zod';

export const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

export const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .or(z.literal(''))
  .optional()
  .transform((value) => value || null);
