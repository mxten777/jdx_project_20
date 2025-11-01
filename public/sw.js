// Minimal resilient service worker
// Avoids bulk precache (cache.addAll) that fails if any resource 404s.
const RUNTIME_CACHE = 'runtime-cache-v1';

self.addEventListener('install', (event) => {
  // Activate immediately so new SW can take control
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // cleanup old caches except our runtime
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== RUNTIME_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Network-first: try network, fall back to cache if offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      // cache successful GET responses for later offline use, but don't block on caching
      if (res && res.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      // final fallback for navigation requests
      if (req.mode === 'navigate') {
        const index = await caches.match('/index.html');
        if (index) return index;
      }
      return new Response('Service Unavailable', { status: 503 });
    }
  })());
});

// Allow clients to trigger skipWaiting via postMessage
self.addEventListener('message', (evt) => {
  if (evt.data && evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});