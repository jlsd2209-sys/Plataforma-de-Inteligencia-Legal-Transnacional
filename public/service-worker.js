// ============================================================
//  service-worker.js — Unidad de IA PWA
//  Archivo va en: public/service-worker.js
// ============================================================

const CACHE_NAME = 'unidad-ia-v1';

// Archivos que se guardan en caché para funcionar sin internet
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── INSTALACIÓN: guarda los assets estáticos en caché ───────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activa el SW inmediatamente sin esperar a que se cierren las pestañas
  self.skipWaiting();
});

// ── ACTIVACIÓN: limpia cachés viejas ────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ── FETCH: estrategia Network First ─────────────────────────
// Intenta la red primero; si falla, usa la caché.
// Las llamadas a N8N (unidaddeia.duckdns.org) siempre van a la red.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Las llamadas a N8N NUNCA se cachean — siempre van directo a la red
  if (url.hostname === 'unidaddeia.duckdns.org') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para el resto: intenta red, si falla usa caché
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guarda en caché solo respuestas válidas de GET
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Sin red: devuelve desde caché
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Si no hay caché, devuelve el index.html (SPA fallback)
          return caches.match('/index.html');
        });
      })
  );
});
