/* ============================================
   Service Worker - Division Zero
   ============================================
   
   Cache Strategy:
   - CSS/JS: Cache first (versioned via cache name)
   - HTML: Network first, cache fallback
   - Images: Cache first
   - Data: Network first, cache fallback
   
   ============================================ */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `divisionzero-${CACHE_VERSION}`;

// Files to cache on install
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
    '/data/projects.json',
    '/data/tools.json',
    '/data/dictionary.json',
    '/data/icons.json'
];


// === INSTALL ===
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching files...');
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
    console.log('[SW] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
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

    // Skip external requests
    if (!url.origin.includes(self.location.origin)) return;

    // Skip Discord/Supabase API calls
    if (url.hostname.includes('discord') || url.hostname.includes('supabase')) {
        return;
    }

    // HTML files: Network first, cache fallback
    if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Static assets (JS, CSS, images): Cache first
    if (url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff2?)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then((cached) => {
                    if (cached) return cached;

                    return fetch(event.request).then((response) => {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clone);
                        });
                        return response;
                    });
                })
        );
        return;
    }

    // JSON data: Network first, cache fallback
    if (url.pathname.endsWith('.json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Default: Network first
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
