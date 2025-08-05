// Service Worker för Pistolskytte Info App
const CACHE_NAME = 'pistolskytte-info-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/assets/styles/main.css'
];

// Installation av service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache öppnad');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache och returnera requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - returnera response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Kontrollera om vi fick en giltig response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Klona responsen eftersom den är en stream som bara kan användas en gång
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Uppdatera service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
