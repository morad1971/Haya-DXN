const CACHE_NAME = 'haya-dxn-v2'; // قمنا بتغيير الإصدار لضمان تحديث الكاش عند المستخدمين
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './tools/index.html',
  './product-catalog/index.html',
  './register/index.html',
  // أضف أي ملفات CSS أو صور أساسية هنا
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// مرحلة التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم فتح الكاش وحفظ الملفات الجديدة');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// مرحلة التفعيل: حذف الكاش القديم للمستودعات السابقة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// استراتيجية الاستجابة: البحث في الكاش أولاً، ثم الشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
