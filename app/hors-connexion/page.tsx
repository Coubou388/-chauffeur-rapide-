import { LinkButton } from "@/components/ui/Button";

// Page statique servie par le service worker (public/sw.js) quand une
// navigation échoue faute de réseau. Ne fait aucun appel base de données.
export const metadata = { title: "Hors connexion — Chauffeur Rapide" };

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span aria-hidden className="text-5xl">📡</span>
      <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
        Vous êtes hors connexion
      </h1>
      <p className="mt-2 text-stone-600">
        Impossible de charger cette page sans connexion internet. Vérifiez
        votre réseau puis réessayez.
      </p>
      <LinkButton href="/" className="mt-6">
        Réessayer
      </LinkButton>
    </div>
  );
}
