const FILES_TO_CACHE = [
  "/index.html",
  "/styles.css",
  "/manifest.webmanifest",
  "index.js",
];

const STATIC_CACHE = `static-cache-v1`;
const DATA_CACHE_NAME = "data-cache-v1";
//install
self.addEventListener("install", function (evt) {
  //pre cache all static assets
  evt.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//activate
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", evt => {
  if (evt.request.url.includes('/api/transaction')) {
    console.log('[Service Worker] Fetch(data)', evt.request.url);

    evt.respondWith(
      caches.open(STATIC_CACHE).then(cache => {
        return fetch(evt.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );
    return;
  }

  evt.respondWith(
    caches.open(DATA_CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});