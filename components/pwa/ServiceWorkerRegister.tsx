"use client";

import { useEffect } from "react";

// Enregistre le service worker (public/sw.js) côté client uniquement.
// Composant volontairement minuscule et sans rendu visuel.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[ServiceWorker] échec de l'enregistrement :", err);
    });
  }, []);

  return null;
}
