// Service worker (not registered by default; see README note).
// Paths are relative to this file, so it works under /ask/ and at a domain root.
const CACHE_NAME = 'anoopsingh-v4';
const STATIC_ASSETS = [
  './',
  './about/',
  './products/',
  './case-studies/',
  './404.html',
  './manifest.json',
  './favicon.ico',
  './assets/img/anoop.webp',
  './assets/img/screenshot-wide.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // One missing file must not abort the whole install (cache.addAll is all-or-nothing)
      Promise.all(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Pages: network first, fall back to cache, then the 404 page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(request)) || (await caches.match('./404.html')))
    );
    return;
  }

  // Assets: stale-while-revalidate, so a new deploy is picked up on the next visit
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
