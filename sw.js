/* Guarda só a "casca" do app (ícones e página inicial). Os dados financeiros nunca ficam no celular:
   eles são sempre buscados no Google na hora. */
const CACHE = 'financas-ke-v1';
const CASCA = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CASCA); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; /* Google/Apps Script: sempre direto da rede */
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
});
