/**
 * Cache version here...--------------------------------------
 */
let cached_version = 'v 0.0.2 PWANative';
/**
 * Assets to be cached----------------------------------------
 */
let cached_assets = [];

// install event
self.addEventListener('install', function (event) {
    console.log('[SW] Installed...');
    event.waitUntil(
        caches.open(cached_version)
            .then(cache => {
                cache.addAll(cached_assets);
            })
            .then(function () {
                self.skipWaiting();
            })
    );
})

// activate event
self.addEventListener('activate', function (event) {
    console.log('[SW] Activated...');
    event.waitUntil(
        caches.keys().then(cachedVersions => {
            return Promise.all(
                cachedVersions.map(cache => {
                    if (cache !== cached_version) {
                        console.log('[SW] Updating (clearing old version...)');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
})

// fetch event
self.addEventListener('fetch', function (event) {
    console.log('[SW] Fetching...')
    event.respondWith(
        fetch(event.request).then(res => {
            let resClone = res.clone();
            caches.open(cached_version).then(cache => {
                cache.put(event.request, resClone);
            });
            return res;
        }).catch(err => caches.match(event.request).then(res => res))
    );
});