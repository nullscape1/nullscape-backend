import { z } from 'zod';

export const serviceCreateSchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  order: z.coerce.number().optional(),
  features: z.array(z.string()).optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update: all optional; coerce order; treat empty string name as omit
export const serviceUpdateSchema = z.object({
  name: z.preprocess((v) => (v === '' ? undefined : v), z.string().min(2).optional()),
  icon: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  order: z.coerce.number().optional(),
  features: z.array(z.string()).optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
}).partial();
