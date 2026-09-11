const CACHE_NAME = 'for-haruka-v2';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './assets/css/styles.css', './assets/js/script.js', './pages/love.html', './pages/monthsary.html', './pages/memories.html', './assets/css/love.css', './assets/css/monthsary.css', './assets/css/memories.css'];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', (event) => { if (event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { const copy = response.clone(); if (new URL(event.request.url).origin === self.location.origin) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response; }))); });
