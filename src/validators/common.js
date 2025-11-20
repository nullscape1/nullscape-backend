import { z } from 'zod';

export const idParamSchema = z.object({ id: z.string().min(12) });

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  q: z.string().optional(),
  status: z.string().optional(),
});



