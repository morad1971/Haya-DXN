const CACHE_NAME = 'haya-dxn-v2'; // تغيير الإصدار عند تحديث الموقع
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './haya-award.jpg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// مرحلة التثبيت: تخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // تفعيل السيرفس وركر الجديد فوراً
});

// مرحلة التنشيط: تنظيف الكاش القديم
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

// استراتيجية جلب البيانات: Stale-While-Revalidate
// تعرض المحتوى من الكاش فوراً وتحدثه في الخلفية
self.addEventListener('fetch', event => {
  // تجاهل الطلبات التي ليست من نوع http أو https (مثل chrome-extension)
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // تحديث الكاش بالنسخة الجديدة من الشبكة
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // إرجاع نسخة الكاش إذا وجدت، أو الانتظار لجلبها من الشبكة
        return response || fetchPromise;
      });
    })
  );
});
