const CACHE_NAME = 'haya-dxn-v3'; // تحديث الإصدار لضمان تنشيط التعديلات الجديدة
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/haya-award.jpg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// مرحلة التثبيت: تخزين الملفات الأساسية في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

// مرحلة التنشيط: حذف أي كاش قديم لتجنب تعارض الملفات
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// استراتيجية جلب البيانات: تخدم من الكاش وتحدث في الخلفية (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
