// ChitraCut service worker — app works without internet after the first visit
const CACHE = 'chitracut-v32';
const RUNTIME = 'chitracut-runtime';   // fonts, AI libraries (kept across versions)
const FILES = ['./', './index.html', './style.css', './core.js', './extras.js', './ui.js', './manifest.json', './icon-192.png', './icon-512.png', './previews/temple.jpg', './previews/flower.jpg', './previews/coffee.jpg', './previews/cat.jpg', './previews/rocket.jpg', './previews/space.jpg'];
const CDN = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'storage.googleapis.com', 'picsum.photos'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== RUNTIME).map(k => caches.delete(k)))));
  self.clients.claim();
});
const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // app files: newest version when online (3 s limit), cached copy when offline
  if (url.origin === self.location.origin) {
    e.respondWith(
      timeout(fetch(req), 3000)
        .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // fonts + AI libraries: cache first (they never change for a given URL)
  if (CDN.some(h => url.hostname === h || url.hostname.endsWith('.' + h))) {
    e.respondWith(
      caches.open(RUNTIME).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; })))
    );
  }
});
