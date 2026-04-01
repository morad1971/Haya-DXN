const cacheName = 'haya-platform-v1';
const staticAssets = [
  './',
  './index.html',
  './manifest.json',
  './icons/haya-award.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية في الذاكرة
self.addEventListener('install', async el => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

// جلب البيانات من الذاكرة (Cache) عند انقطاع الإنترنت لضمان سرعة التصفح
self.addEventListener('fetch', el => {
  const req = el.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    el.respondWith(cacheFirst(req));
  } else {
    el.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
