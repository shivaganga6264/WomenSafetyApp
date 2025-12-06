const CACHE_NAME = 'safety-app-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event - Clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // 1️⃣ Allow backend API calls to bypass cache
  if (reqUrl.pathname.startsWith('/api/')) {
    return; // Let network handle it
  }

  // 2️⃣ Allow ALL external CDN calls (FontAwesome, Google Fonts)
  if (reqUrl.origin !== self.location.origin) {
    return; // Do not intercept
  }

  // 3️⃣ Cache only local files
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
    })
  );
});
