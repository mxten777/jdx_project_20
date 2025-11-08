// Enhanced service worker with intelligent caching strategies
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-cache-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;

// Critical resources to precache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // Only cache critical resources that we know exist
    await cache.addAll(PRECACHE_URLS.filter(url => url));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // cleanup old caches
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.includes('cache-') && !key.includes(CACHE_VERSION))
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

// Enhanced fetch strategy with different caching approaches
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  
  if (req.method !== 'GET') return;

  // Static assets: Cache-first
  if (req.url.includes('/assets/') || req.url.includes('.js') || req.url.includes('.css')) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
  }
  // API calls: Network-first with stale-while-revalidate
  else if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstWithSWR(req, API_CACHE));
  }
  // HTML pages: Network-first
  else if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
  }
  // Everything else: Stale-while-revalidate
  else {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
  }
});

// Cache-first strategy for static assets
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Network-first with stale-while-revalidate for APIs
async function networkFirstWithSWR(request, cacheName) {
  const cached = await caches.match(request);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (cached) {
      // Background update
      fetch(request).then(response => {
        if (response.ok) {
          const cache = caches.open(cacheName);
          cache.then(c => c.put(request, response.clone()));
        }
      }).catch(() => {});
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Allow clients to trigger skipWaiting via postMessage
self.addEventListener('message', (evt) => {
  if (evt.data && evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});