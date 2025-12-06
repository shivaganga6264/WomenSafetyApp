const CACHE_NAME = 'safety-app-v4';

const urlsToCache = [
  '/WomenSafetyApp/',
  '/WomenSafetyApp/index.html',
  '/WomenSafetyApp/manifest.json',
  '/WomenSafetyApp/icon-192.png',
  '/WomenSafetyApp/icon-512.png'
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

  // Skip backend API
  if (reqUrl.pathname.includes('/send-alert')) {
    return;
  }

  // Skip external domains
  if (reqUrl.origin !== self.location.origin) {
    return;
  }

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


