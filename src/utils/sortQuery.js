/**
 * Safe sort string for Mongoose from ?sort= — rejects objects and odd characters (query-string injection).
 * @param {unknown} sortInput
 * @param {string} defaultSort
 * @param {Set<string>} allowedFields
 */
export function parseListSort(sortInput, defaultSort, allowedFields) {
  if (sortInput == null || sortInput === '') return defaultSort;
  if (typeof sortInput === 'object') return defaultSort;
  const s = String(sortInput).trim();
  if (!s) return defaultSort;
  if (!/^[-+]?[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) return defaultSort;
  const field = s.replace(/^[-+]/, '');
  if (!allowedFields.has(field)) return defaultSort;
  return s.startsWith('+') ? field : s;
}
