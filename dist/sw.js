/* ============================================
   Service Worker - Division Zero SPA v2.0
   ============================================
   
   OPTIMIZED FOR SPA:
   - Only 6 files to cache (index.html contains all pages)
   - Projects API cached for 15 minutes
   - Cache first for all static assets
   
   Target: 6 edge requests total!
   
   ============================================ */

const CACHE_VERSION = '2.0';
const CACHE_NAME = `divisionzero-${CACHE_VERSION}`;

// Minimal cache list for SPA
const CACHE_FILES = [
    '/',
    '/app.min.js',
    '/styles.min.css',
    '/manifest.json',
    '/assets/images/white-logo.svg',
    '/assets/images/white-name.svg'
];

// Projects API cache (15 min)
const API_CACHE = 'divisionzero-api';
const API_CACHE_DURATION = 15 * 60 * 1000;


// === INSTALL ===
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v' + CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching SPA files...');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('[SW] Install complete');
                return self.skipWaiting();
            })
    );
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
    // All routes serve the same index.html
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/').then(cached => {
                return cached || fetch(event.request);
            })
        );
        return;
    }

    // === STATIC ASSETS ===
    // Cache first for everything else
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) return cached;

                return fetch(event.request).then((response) => {
                    if (response.ok) {
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
