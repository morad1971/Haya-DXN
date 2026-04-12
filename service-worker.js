const CACHE_NAME = 'haya-dxn-v3';   // زد الرقم في كل تحديث كبير

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  
  // الصفحات الرئيسية
  './tools/index.html',
  './product-catalog/index.html',
  './register/index.html',
  './stories/index.html',        // إذا كانت موجودة
  
  // الأيقونات
  './icons/icon-192.png',
  './icons/icon-512.png',
  
  // ملفات خارجية مهمة (للعمل أوفلاين بشكل أفضل)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Vazirmatn:wght@100;300;400;700;900&display=swap',
  'https://unpkg.com/lucide@latest'
];

// ====================== مرحلة التثبيت ======================
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: All assets cached successfully');
        return self.skipWaiting();   // تفعيل فوري
      })
  );
});

// ====================== مرحلة التفعيل ======================
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();   // السيطرة على جميع الصفحات فورًا
});

// ====================== استراتيجية الـ Fetch ======================
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إرجاع من الكاش إذا وجد، وإلا جلب من الشبكة
        return response || fetch(event.request);
      })
  );
});
