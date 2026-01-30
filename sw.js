const CACHE = "biskra-cs-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./sw.js",
  "./app.js",
  "./manifest.json",
  "./icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "https://biskra-cs-student-helper.vercel.app/",
  "https://biskra-cs-student-helper.vercel.app/index.html",
  "https://biskra-cs-student-helper.vercel.app/style.css",
  "https://biskra-cs-student-helper.vercel.app/app.js",
  "https://biskra-cs-student-helper.vercel.app/manifest.json",
  "https://biskra-cs-student-helper.vercel.app/icon.png",
  "https://biskra-cs-student-helper.vercel.app/sw.js",
  "https://biskra-cs-student-helper.vercel.app/icon-192.png",
  "https://biskra-cs-student-helper.vercel.app/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => key !== CACHE ? caches.delete(key) : null)
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
      }
        return fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('https://biskra-cs-student-helper.vercel.app/index.html');
          }
      });
    })
  );
});