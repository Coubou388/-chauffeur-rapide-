import type { MetadataRoute } from "next";

// Manifeste PWA — permet l'installation sur l'écran d'accueil (mobile et
// desktop). Voir aussi public/sw.js (service worker) et
// components/pwa/ServiceWorkerRegister.tsx.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chauffeur Rapide",
    short_name: "Chauffeur Rapide",
    description:
      "Trouvez un chauffeur vérifié en Côte d'Ivoire : taxi, VTC, wôrô-wôrô, gbaka, chauffeur personnel et plus.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fafaf9",
    theme_color: "#dc2626",
    lang: "fr",
    categories: ["travel", "business", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
