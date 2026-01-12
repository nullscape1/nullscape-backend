import { z } from 'zod';

export const serviceCreateSchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  category: z.string().optional(), // Category name
  categoryId: z.string().optional(), // Category ID (ObjectId)
  order: z.number().int().min(0).optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();



