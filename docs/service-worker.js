// service-worker.js
const CACHE_NAME = "my-first-pwa";
const DATA_CACHE_NAME = "my-first-pwa-data";
const API_URL = "http://api.openweathermap.org/data";
const filesToCaches = [
  "/",
  "/app.js",
  "/index.html",
  "/style.css",
  "/images/01d.png",
  "/images/01n.png",
  "/images/02d.png",
  "/images/02n.png",
  "/images/03d.png",
  "/images/03n.png",
  "/images/04d.png",
  "/images/04n.png",
  "/images/09d.png",
  "/images/09n.png",
  "/images/10d.png",
  "/images/10n.png",
  "/images/11d.png",
  "/images/11n.png",
  "/images/13d.png",
  "/images/13n.png",
  "/images/50d.png",
  "/images/50n.png"
];

self.addEventListener("install", (evt) => {
  logging("Install");

  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        logging("cache open");
        return cache.addAll(filesToCaches);
      })
  );
});


self.addEventListener("activate", (evt) => {
  logging("Activate");

  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          logging(`Removing old cache ${key}`);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener("fetch", (evt) => {
  logging(`Fetch: ${evt.request.url}`);

  if (evt.request.url.indexOf(API_URL) > -1) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              cache.put(evt.request.url, response.clone());
              return response;
            });
        })
    );
  } else {
    evt.respondWith(
      caches.match(evt.request)
        .then((response) => {
          return response || fetch(evt.request);
        })
    );
  }
});

/**
 * logging
 * @param {string} msg 
 */
function logging(msg) {
  console.log(`[ServiceWorker] ${msg}`);
}
