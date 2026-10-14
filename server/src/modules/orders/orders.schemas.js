import { z } from 'zod';
import { paginationQuery } from '../../utils/pagination.js';

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const requiredText = (label, max) => z.string().trim().min(2, `${label} is required`).max(max);

export const checkoutBody = z.object({
  shippingName: requiredText('Full name', 100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, 'Enter a valid phone number'),
  address: requiredText('Address', 255),
  city: requiredText('City', 100),
  postalCode: z.string().trim().min(3, 'Postal code is required').max(20),
  country: requiredText('Country', 100),
});

export const listOrdersQuery = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  page: paginationQuery.page,
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const statusBody = z.object({
  status: z.enum(ORDER_STATUSES),
});
