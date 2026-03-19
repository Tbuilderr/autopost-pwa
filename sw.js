const CACHE = 'autopost-v8';
const BASE = '/autopost-pwa/';
const ASSETS = [BASE, BASE + 'index.html', BASE + 'manifest.json', BASE + 'icon-192.png', BASE + 'icon-512.png', BASE + 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first strategy: always try fresh, fall back to cache for offline
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
