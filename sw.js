/**
 * The cache name for the service worker.
 * @type {string}
 */
const CACHE = "biskra-cs-v17";

/**
 * The assets to be cached by the service worker.
 * @type {string[]}
 */
const ASSETS = ["./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.png",
  "./adkar.js",
  "./calculator.js",
  "./habits.js",
  "./modules.js",
  "./persistence.js",
  "./pomodoro.js",
  "./quiz.js",
  "./router.js",
  "./theme.js",
  "./ui.js",
  "./docs/adkar.js.html",
  "./docs/calculator.js.html",
  "./docs/global.html",
  "./docs/habits.js.html",
  "./docs/index.html",
  "./docs/modules.js.html",
  "./docs/persistence.js.html",
  "./docs/pomodoro.js.html",
  "./docs/quiz.js.html",
  "./docs/router.js.html",
  "./docs/sw.js.html",
  "./docs/theme.js.html",
  "./docs/ui.js.html",
  "./docs/fonts/OpenSans-Bold-webfont.eot",
  "./docs/fonts/OpenSans-Bold-webfont.svg",
  "./docs/fonts/OpenSans-Bold-webfont.woff",
  "./docs/fonts/OpenSans-BoldItalic-webfont.eot",
  "./docs/fonts/OpenSans-BoldItalic-webfont.svg",
  "./docs/fonts/OpenSans-BoldItalic-webfont.woff",
  "./docs/fonts/OpenSans-Italic-webfont.eot",
  "./docs/fonts/OpenSans-Italic-webfont.svg",
  "./docs/fonts/OpenSans-Italic-webfont.woff",
  "./docs/fonts/OpenSans-Light-webfont.eot",
  "./docs/fonts/OpenSans-Light-webfont.svg",
  "./docs/fonts/OpenSans-Light-webfont.woff",
  "./docs/fonts/OpenSans-LightItalic-webfont.eot",
  "./docs/fonts/OpenSans-LightItalic-webfont.svg",
  "./docs/fonts/OpenSans-LightItalic-webfont.woff",
  "./docs/fonts/OpenSans-Regular-webfont.eot",
  "./docs/fonts/OpenSans-Regular-webfont.svg",
  "./docs/fonts/OpenSans-Regular-webfont.woff",
  "./docs/scripts/linenumber.js",
  "./docs/scripts/prettify/lang-css.js",
  "./docs/scripts/prettify/prettify.js",
  "./docs/styles/jsdoc-default.css",
  "./docs/styles/prettify-jsdoc.css",
  "./docs/styles/prettify-tomorrow.css",];


/**
 * The install event listener for the service worker.
 * This is triggered when the service worker is first installed.
 * @param {ExtendableEvent} event - The install event.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

/**
 * The activate event listener for the service worker.
 * This is triggered when the service worker is activated.
 * @param {ExtendableEvent} event - The activate event.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

/**
 * The fetch event listener for the service worker.
 * This is triggered when the browser fetches a resource.
 * @param {FetchEvent} event - The fetch event.
 */
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
