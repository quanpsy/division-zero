/* ============================================
   Service Worker - Division Zero SPA v2.1
   ============================================
   
   CACHE-ON-DEMAND STRATEGY:
   - NO precaching (avoids duplicate requests!)
   - Files cached as they're loaded
   - Projects API cached for 15 minutes
   
   Target: ~9 edge requests per first visit!
   
   ============================================ */

const CACHE_VERSION = '2.1';
const CACHE_NAME = `divisionzero-${CACHE_VERSION}`;

// Projects API cache (15 min)
const API_CACHE = 'divisionzero-api';
const API_CACHE_DURATION = 15 * 60 * 1000;


// === INSTALL ===
// No precaching! Just activate immediately.
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v' + CACHE_VERSION + ' (no precache)');
    self.skipWaiting();
});


// === ACTIVATE ===
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating v' + CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.startsWith('divisionzero-') &&
                            cacheName !== CACHE_NAME &&
                            cacheName !== API_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activated');
                return self.clients.claim();
            })
    );
});


// === FETCH ===
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // === CLOUDFLARE WORKER API ===
    if (url.hostname.includes('workers.dev')) {
        event.respondWith(handleApiRequest(event.request));
        return;
    }

    // === EXTERNAL REQUESTS (fonts, CDN) ===
    if (!url.origin.includes(self.location.origin)) {
        return; // Let browser handle
    }

    // === SPA NAVIGATION ===
    // All routes serve the same index.html from cache if available
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/').then(cached => {
                if (cached) {
                    console.log('[SW] SPA HTML from cache');
                    return cached;
                }
                return fetch(event.request).then(response => {
                    // Cache the SPA HTML for future navigations
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put('/', clone));
                    return response;
                });
            })
        );
        return;
    }

    // === STATIC ASSETS ===
    // Cache-first: serve from cache, fetch and cache if not found
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    console.log('[SW] Cache hit:', url.pathname);
                    return cached;
                }

                // Not in cache - fetch and cache for next time
                return fetch(event.request).then((response) => {
                    if (response.ok && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                });
            })
    );
});


// === API HANDLER (with 15 min cache) ===
async function handleApiRequest(request) {
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);

    if (cached) {
        const cachedAt = cached.headers.get('sw-cached-at');
        if (cachedAt) {
            const age = Date.now() - parseInt(cachedAt);
            if (age < API_CACHE_DURATION) {
                console.log('[SW] API from cache');
                return cached;
            }
        }
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            const headers = new Headers(response.headers);
            headers.set('sw-cached-at', Date.now().toString());
            const cachedResponse = new Response(response.clone().body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
            });
            cache.put(request, cachedResponse);
        }
        return response;
    } catch (err) {
        return cached || new Response('{}', { status: 503 });
    }
}


// === MESSAGE HANDLER ===
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
