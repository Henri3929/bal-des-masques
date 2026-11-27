// Permet d'installer le jeu et de le relancer sans connexion.
// Stratégie : on prend toujours la version la plus récente sur internet,
// et si internet ne répond pas, on utilise la copie gardée sur le téléphone.
const CACHE = 'bal-des-masques-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((reponse) => {
        if (reponse.ok) {
          const copie = reponse.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copie));
        }
        return reponse;
      })
      .catch(() => caches.match(e.request))
  );
});
