const CACHE_NAME = "haya-platform-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/haya-award.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
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

  // فقط GET
  if (req.method !== "GET") return;

  // تجاهل أي بروتوكول غير http/https
  if (!url.protocol.startsWith("http")) return;

  // تعامل فقط مع نفس الأصل (ملفات موقعك)
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
    // fallback بسيط إذا النت مقطوع والملف غير مخزن
    return new Response("Offline", {
      status: 503,
      statusText: "Offline"
    });
  }
}
