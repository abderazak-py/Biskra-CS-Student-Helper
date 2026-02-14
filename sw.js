
const CACHE = "biskra-cs-v31";

const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icon.png",
  "/adkar.js",
  "/calculator.js",
  "/flashcards.js",
  "/habits.js",
  "/khetma.js",
  "/modules.js",
  "/persistence.js",
  "/pomodoro.js",
  "/quiz.js",
  "/router.js",
  "/theme.js",
  "/ui.js",
  "/resources.js",
  "/teachers.js",
];

self.addEventListener("install", (event) => {
  // Common to call skipWaiting() in install; its promise can be ignored. [web:1]
  self.skipWaiting();

  // The promise passed to waitUntil controls install success/failure. [web:4]
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Resilient precache: one missing asset won't block the whole update.
    await Promise.allSettled(ASSETS.map((url) => cache.add(url)));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));

    // Claim clients during activate so pages don't need a reload to be controlled. [web:11]
    await self.clients.claim();
  })());
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function navigationNetworkFirstWithShellFallback(request) {
  try {
    return await fetch(request);
  } catch {
    return (await caches.match("/index.html")) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Handle HTML navigations (contributors.html, index.html, etc.). [web:30]
  if (req.mode === "navigate") {
    event.respondWith(navigationNetworkFirstWithShellFallback(req));
    return;
  }

  // Static assets: cache-first
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.destination === "image" ||
    req.destination === "font"
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Default: cache, else network
  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
