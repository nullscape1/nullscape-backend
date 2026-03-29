import { z } from 'zod';

const listQuerySchema = z.object({
  page: z.preprocess((v) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(Math.floor(n), 1_000_000);
  }, z.number().int()),
  limit: z.preprocess((v) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 1) return 20;
    return Math.min(Math.floor(n), 100);
  }, z.number().int()),
  q: z.preprocess((v) => {
    if (v == null || v === '') return undefined;
    const s = String(v).trim().slice(0, 200);
    return s || undefined;
  }, z.string().optional()),
  status: z.preprocess((v) => {
    if (v == null || v === '') return undefined;
    const s = String(v).trim().slice(0, 64);
    return s || undefined;
  }, z.string().optional()),
  resolved: z.preprocess((v) => {
    if (v === undefined || v === '') return undefined;
    if (String(v) === 'true') return true;
    if (String(v) === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  sort: z.unknown().optional(),
});

/**
 * Coerce and cap list query params (pagination, search, filters).
 * @param {Record<string, unknown>} raw - req.query
 */
export function parseCrudListQuery(raw) {
  const parsed = listQuerySchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  return {
    page: 1,
    limit: 20,
    q: undefined,
    status: undefined,
    resolved: undefined,
    sort: raw?.sort,
  };
}
