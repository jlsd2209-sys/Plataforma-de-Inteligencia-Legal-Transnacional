// ============================================================
//  service-worker.js — Unidad de IA PWA (Ultra Simplificado)
// ============================================================

// Incrementamos a v4 para forzar a los dispositivos a limpiar 
// la caché antigua y descargar los nuevos videos.
const CACHE_NAME = 'unidad-ia-v4'; 

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.navegador.png',
  '/Logo durante carga Movil.jpg', // Se mantiene SÓLO para la etiqueta apple-touch-startup-image de iOS
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/loader-movil.mp4',             // NUEVO: Video optimizado para Móvil
  '/loader-pc.mp4'                 // NUEVO: Video optimizado para PC
];

// ── INSTALACIÓN ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVACIÓN ──────────────────────────────────────────────
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

// ── FETCH: Estrategia Network First ─────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones a la API externa para no guardarlas en caché estática
  if (url.hostname === 'unidaddeia.duckdns.org') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return caches.match('/index.html');
        });
      })
  );
});
