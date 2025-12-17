/* ============================================
   Service Worker - Division Zero v1.2
   ============================================
   
   AGGRESSIVE CACHING STRATEGY:
   - First visit: ~5 edge requests (SW install + precache)
   - Return visit: ~1-2 edge requests (only projects API)
   - All static files cached for 1 year
   - Projects API cached for 15 minutes
   
   Target: 100K users on Vercel free tier
   
   ============================================ */

const CACHE_VERSION = '1.2';
const CACHE_NAME = `divisionzero-${CACHE_VERSION}`;

// Projects API cache (15 min)
const PROJECTS_CACHE = 'divisionzero-projects';
const PROJECTS_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// ALL static files to precache on first install
// After this, NO more edge requests needed for these files!
const CACHE_FILES = [
    '/',
    '/index.html',
    '/projects.html',
    '/tools.html',
    '/dictionary.html',
    '/submit.html',
    '/app.min.js',
    '/styles.min.css',
    '/manifest.json',
    '/assets/images/white-logo.svg',
    '/assets/images/white-name.svg',
    '/data/tools.json',
    '/data/dictionary.json',
    '/data/icons.json'
];


// === INSTALL ===
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v' + CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching all static files...');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('[SW] Install complete - all files cached!');
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
                        // Delete old version caches (but keep projects cache)
                        if (cacheName.startsWith('divisionzero-') &&
                            cacheName !== CACHE_NAME &&
                            cacheName !== PROJECTS_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activated - old caches cleared');
                return self.clients.claim();
            })
    );
});


// === FETCH ===
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // === CLOUDFLARE WORKER API (Projects) ===
    // Cache for 15 minutes to reduce edge requests
    if (url.hostname.includes('workers.dev') && url.pathname === '/projects') {
        event.respondWith(
            caches.open(PROJECTS_CACHE).then(async (cache) => {
                const cached = await cache.match(event.request);

                if (cached) {
                    // Check if cache is still fresh (15 min)
                    const cachedDate = cached.headers.get('sw-cached-at');
                    if (cachedDate) {
                        const age = Date.now() - parseInt(cachedDate);
                        if (age < PROJECTS_CACHE_DURATION) {
                            console.log('[SW] Projects API from cache (age: ' + Math.round(age / 1000) + 's)');
                            return cached;
                        }
                    }
                }

                // Fetch fresh and cache
                console.log('[SW] Fetching fresh projects API');
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        // Clone and add timestamp header
                        const headers = new Headers(response.headers);
                        headers.set('sw-cached-at', Date.now().toString());
                        const cachedResponse = new Response(response.clone().body, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: headers
                        });
                        cache.put(event.request, cachedResponse);
                    }
                    return response;
                }).catch(() => cached || new Response('{}'));
            })
        );
        return;
    }

    // === EXTERNAL REQUESTS ===
    // Let these pass through (fonts, CDN, etc.)
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // === ALL INTERNAL REQUESTS ===
    // Cache first for everything! (our files never change between deploys)
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    console.log('[SW] Cache hit:', url.pathname);
                    return cached;
                }

                // Not in precache - fetch and cache for next time
                console.log('[SW] Cache miss, fetching:', url.pathname);
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


// === MESSAGE HANDLER ===
// Listen for "update" message to force refresh
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    if (event.data === 'clearCache') {
        caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
        });
    }
});
