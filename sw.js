/* Multi Business — সার্ভিস ওয়ার্কার (অফলাইনেও খোলার জন্য)
   নিয়ম: আগে ইন্টারনেটে নতুন ফাইল দেখি, না পেলে সেভ করা ফাইল দিই।
   তাই অ্যাপ আপডেট করলে নতুনটাই আসে, আর নেট না থাকলেও অ্যাপ খোলে। */
const CACHE = 'multi-business-v1';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
