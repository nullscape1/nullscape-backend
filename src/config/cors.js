/**
 * CORS helpers: dev allows local/LAN origins; production uses CORS_ORIGIN (comma-separated).
 */

export function isDevAllowedOrigin(origin) {
  if (!origin) return true;
  const allowed = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
  ]);
  if (allowed.has(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (!['3000', '8000'].includes(u.port)) return false;
    const h = u.hostname;
    if (h === 'localhost' || h === '127.0.0.1') return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  } catch {
    return false;
  }
  return false;
}

export function getCorsOptions() {
  const envList = (val) =>
    String(val || '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

  const extraOrigins = [
    process.env.SITE_URL,
    process.env.WEBSITE_URL,
    process.env.ADMIN_URL,
  ]
    .map((s) => (s ? String(s).trim().replace(/\/$/, '') : ''))
    .filter(Boolean);

  const fromCorsOrigin = envList(process.env.CORS_ORIGIN).map((s) => s.replace(/\/$/, ''));
  const merged = Array.from(new Set([...fromCorsOrigin, ...extraOrigins]));

  return {
    origin: merged.length
      ? merged
      : process.env.NODE_ENV === 'production'
          ? (_origin, callback) => {
              callback(null, false);
            }
          : (origin, callback) => {
              if (isDevAllowedOrigin(origin)) {
                callback(null, true);
              } else {
                callback(null, false);
              }
            },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
  };
}
