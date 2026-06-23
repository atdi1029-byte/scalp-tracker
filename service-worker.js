const CACHE_NAME = 'scalp-tracker-v12';
const ASSETS = [
  './',
  './index.html',
  './bg.webp',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js'
];

// Install — cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok && event.request.method === 'GET') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache =>
          cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request)
      .then(cached => cached || caches.match('./index.html')))
  );
});
