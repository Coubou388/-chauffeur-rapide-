// Service worker minimal pour Chauffeur Rapide.
//
// L'app est très dynamique (recherche, dashboards, contenu protégé par
// session) : on évite volontairement de mettre les pages en cache pour ne
// jamais servir de données obsolètes ou privées à la mauvaise personne.
// Le seul rôle de ce service worker est :
//   1. de rendre le site installable (critère PWA) ;
//   2. d'afficher une page "hors connexion" propre plutôt que l'écran
//      d'erreur du navigateur quand la navigation échoue faute de réseau.
const CACHE_NAME = "chauffeur-rapide-v1";
const OFFLINE_URL = "/hors-connexion";
const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(OFFLINE_URL).then((cached) => cached || Response.error())
    )
  );
});
