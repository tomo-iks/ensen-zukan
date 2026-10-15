// 沿線まち図鑑 のサービスワーカー: 一度表示したページ・地図の区画・写真を、通信がなくても表示できるようにする
const VER = 'ensen-v24';
const CORE = ['./', 'index.html', 'spots.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (same && isPage) {
    // ページ本体は、通信できるときは最新を取り、できないときは覚えているものを出す
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VER).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  const font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (same || font) {
    // 地図の区画・写真・フォントは、覚えているものを先に出す
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(VER).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
