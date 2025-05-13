const createGlobalCache = () => {
  let cache = new Map(); // Stores cached responses per route
  let cacheTimestamps = new Map();
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 90 days in milliseconds

  return (req, res, next) => {
    const cacheKey = req.originalUrl; // Unique cache key based on URL
    const now = Date.now();

    if (
      cache.has(cacheKey) &&
      now - cacheTimestamps.get(cacheKey) < CACHE_EXPIRATION
    ) {
      console.log(`Serving from cache: ${cacheKey}`);
      return res.json(cache.get(cacheKey)); // Serve cached response
    }

    // Store the original res.json function
    res.originalJson = res.json;

    res.json = (body) => {
      cache.set(cacheKey, body); // Store response in cache
      cacheTimestamps.set(cacheKey, Date.now());
      res.originalJson(body); // Send actual response
    };

    next();
  };
};

// Create a cache middleware instance
export const cacheMiddleware = createGlobalCache();
