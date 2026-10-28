// Atalho Plantão: guarda o app para abrir sem internet.
// O app em si vem primeiro da rede (para pegar a versão nova); sem rede, usa a cópia guardada.
// Fontes e bibliotecas de fora ficam guardadas depois da primeira visita.
const VERSAO = 'atalho-plantao-v1';
const BASE = ['./', './index.html', './manifest.webmanifest', './icones/icone-192.png', './icones/icone-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Login, banco e funções do Supabase nunca passam pela cópia guardada.
  if (url.hostname.endsWith('supabase.co') || url.pathname.includes('/functions/')) return;
  if (req.mode === 'navigate' || url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
      return r;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  if (/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(salvo => salvo || fetch(req).then(r => {
      const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); return r;
    })));
  }
});
