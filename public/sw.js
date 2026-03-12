// Puffless Service Worker
const CACHE_NAME = 'puffless-v1';
const STATIC_CACHE = 'puffless-static-v1';
const DYNAMIC_CACHE = 'puffless-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests - always go to network
  if (url.pathname.startsWith('/api/')) return;

  // Skip auth requests
  if (url.pathname.startsWith('/prijava') || url.pathname.startsWith('/registracija')) return;

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback - try cache first
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return cached dashboard as fallback
            return caches.match('/dashboard').then((dashboardCache) => {
              if (dashboardCache) {
                return dashboardCache;
              }
              // Last resort - return offline page
              return new Response(
                `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Puffless — Offline</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #F7FAFC; }
    .container { text-align: center; padding: 2rem; max-width: 400px; }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { color: #1F2937; font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #6B7280; margin-bottom: 1.5rem; }
    .banner { background: #fff4ed; border: 1px solid #FF8C42; border-radius: 12px; padding: 1rem; color: #FF8C42; font-size: 0.875rem; }
    button { background: #2EC4B6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📵</div>
    <h1>Puffless</h1>
    <div class="banner">
      Nema internetske veze. Prikazujemo zadnje dostupne podatke.
    </div>
    <button onclick="window.location.reload()">Pokušaj ponovo</button>
  </div>
</body>
</html>`,
                {
                  headers: { 'Content-Type': 'text/html; charset=utf-8' },
                }
              );
            });
          });
        })
    );
    return;
  }

  // For static assets - cache first strategy
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // For Next.js chunks - stale while revalidate
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cravings') {
    console.log('[SW] Background sync: cravings');
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title || 'Puffless', {
      body: data.body || 'Provjeri svoju nadzornu ploču',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'puffless-notification',
    });
  }
});
