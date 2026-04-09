const CACHE_NAME = "haya-platform-v5";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/haya-award.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  // صفحات المنظومة — احذفي أي مسار غير موجود على GitHub
  "./intro/index.html",
  "./product-catalog/index.html",
  "./top-products/index.html",
  "./comparison/index.html",
  "./budget/index.html",
  "./health-guide/index.html",
  "./stories/index.html",
  "./business/index.html",
  "./register/index.html",
  "./training/index.html",
  "./support/index.html",
  "./tools/index.html",
  "./ask/index.html",
  "./admin/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}
