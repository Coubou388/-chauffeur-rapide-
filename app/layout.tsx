import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

// Pas de next/font/google ici volontairement : évite une dépendance réseau
// au moment du build et garde le MVP simple. La pile de polices système
// définie dans globals.css est déjà lisible et rapide à charger.

export const metadata: Metadata = {
  title: "Chauffeur Rapide — Trouvez un chauffeur en Côte d'Ivoire",
  description:
    "Chauffeur Rapide met en relation clients et chauffeurs vérifiés en Côte d'Ivoire : taxi, VTC, wôrô-wôrô, gbaka, chauffeur personnel et plus.",
  // app/manifest.ts génère /manifest.webmanifest automatiquement.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chauffeur Rapide",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
