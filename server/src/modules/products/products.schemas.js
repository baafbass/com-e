import { z } from 'zod';
import { optionalUrl } from '../../utils/commonSchemas.js';
import { paginationQuery } from '../../utils/pagination.js';

export const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc', 'name_asc', 'rating'];

const booleanFlag = z.enum(['true', 'false']).transform((value) => value === 'true');

export const listProductsQuery = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: booleanFlag.optional(),
  featured: booleanFlag.optional(),
  sort: z.enum(SORT_OPTIONS).default('newest'),
  ...paginationQuery,
});

export const slugParam = z.object({
  slug: z.string().trim().min(1).max(170),
});

export const productBody = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(150),
    description: z.string().trim().max(5000).default(''),
    price: z.coerce.number().min(0, 'Price cannot be negative').max(1_000_000),
    compareAtPrice: z.coerce.number().min(0).max(1_000_000).nullable().optional().default(null),
    stock: z.coerce.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
    imageUrl: optionalUrl,
    categoryId: z.coerce.number().int().positive().nullable().optional().default(null),
    isFeatured: z.boolean().default(false),
  })
  .refine((product) => product.compareAtPrice === null || product.compareAtPrice > product.price, {
    message: 'Compare-at price must be higher than the price',
    path: ['compareAtPrice'],
  });
