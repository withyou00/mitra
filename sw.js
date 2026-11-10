/* ಬೋಧನಾ ಮಿತ್ರ — App ಆಗಿ ಕೆಲಸ ಮಾಡಲು. ವೆಬ್‌ಸೈಟ್‌ನ ಪುಟ ಮತ್ತು ಚಿತ್ರಗಳನ್ನು ಮಾತ್ರ ಇಟ್ಟುಕೊಳ್ಳುತ್ತದೆ;
   ದಾಖಲೆಗಳು, login, ಖರೀದಿ ಯಾವಾಗಲೂ internet ನಿಂದಲೇ. */
const C = 'bm-shell-v1';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;     // ಬೇರೆ ಎಲ್ಲವೂ ನೇರವಾಗಿ internet ಗೆ
  /* ಮೊದಲು internet (ಹೊಸ ಆವೃತ್ತಿ ತಕ್ಷಣ ಸಿಗಲಿ), ಇಲ್ಲದಿದ್ದರೆ ಉಳಿಸಿದ್ದು */
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
