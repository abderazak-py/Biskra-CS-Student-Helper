const CACHE = "biskra-cs-v1";
const ASSETS = [
  ".",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.png",
  "./toggle2.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(caches.match("./index.html"));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
