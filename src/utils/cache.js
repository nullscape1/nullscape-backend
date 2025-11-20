const store = new Map();

// Cache size limit (prevent memory issues)
const MAX_CACHE_SIZE = 1000;

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiry && now > value.expiry) {
      store.delete(key);
    }
  }
  
  // If cache is too large, remove oldest entries
  if (store.size > MAX_CACHE_SIZE) {
    const entries = Array.from(store.entries());
    entries.sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
    const toRemove = entries.slice(0, store.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => store.delete(key));
  }
}, 60000); // Clean up every minute

export function cacheGet(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expiry && Date.now() > hit.expiry) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function cacheSet(key, value, ttlMs = 60000) {
  // Check cache size limit
  if (store.size >= MAX_CACHE_SIZE && !store.has(key)) {
    // Remove oldest entry
    const entries = Array.from(store.entries());
    if (entries.length > 0) {
      entries.sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
      store.delete(entries[0][0]);
    }
  }
  
  store.set(key, {
    value,
    expiry: ttlMs ? Date.now() + ttlMs : 0,
    createdAt: Date.now(),
  });
}

export function cacheClear(pattern = null) {
  if (!pattern) {
    store.clear();
    return;
  }
  
  // Clear entries matching pattern
  for (const key of store.keys()) {
    if (key.includes(pattern)) {
      store.delete(key);
    }
  }
}

export function cacheMiddleware(ttlMs = 60000) {
  return (req, res, next) => {
    // Skip caching for POST, PUT, DELETE requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip caching for authenticated requests (admin panel)
    if (req.user) {
      return next();
    }
    
    const key = `${req.method}:${req.originalUrl}`;
    const cached = cacheGet(key);
    if (cached) {
      // Set cache headers
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }
    
    const json = res.json.bind(res);
    res.json = (body) => {
      cacheSet(key, body, ttlMs);
      res.setHeader('X-Cache', 'MISS');
      return json(body);
    };
    return next();
  };
}
