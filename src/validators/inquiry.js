import { z } from 'zod';

const inquiryTypeEnum = ['contact', 'quote', 'hire', 'newsletter', 'other'];

export const inquiryCreateSchema = z.object({
  type: z.enum(inquiryTypeEnum).default('contact'),
  name: z.string().max(200).optional(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(50).optional(),
  message: z.string().max(10000).optional(),
}).refine((data) => data.email || data.phone || data.name, {
  message: 'At least one of name, email, or phone is required',
  path: ['email'],
});

export const inquiryUpdateSchema = z.object({
  resolved: z.boolean().optional(),
  type: z.enum(inquiryTypeEnum).optional(),
  name: z.string().max(200).optional(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(50).optional(),
  message: z.string().max(10000).optional(),
});
