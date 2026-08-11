import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { WHATSAPP_BUSINESS_NUMBER } from "@/lib/constants";

export const metadata = { title: "Inscription chauffeur via WhatsApp — Chauffeur Rapide" };

const STEPS = [
  "Cliquez sur le bouton ci-dessous : WhatsApp s'ouvre avec un message pré-rempli.",
  "Envoyez le message. Notre assistant vous pose quelques questions (nom, commune, catégorie, expérience, disponibilité, zones).",
  "Une fois terminé, vous recevez un identifiant et un mot de passe temporaire.",
  "Connectez-vous sur le site pour ajouter votre pièce d'identité, votre permis et une photo, puis suivez le statut de votre dossier.",
];

export default function WhatsAppSignupPage() {
  const whatsappHref = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(
    "Bonjour, je veux m'inscrire comme chauffeur sur Chauffeur Rapide"
  )}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        S&apos;inscrire comme chauffeur via WhatsApp
      </h1>
      <p className="mt-2 text-stone-600">
        Pas à l&apos;aise avec les formulaires ? Inscrivez-vous en discutant,
        comme sur WhatsApp normalement.
      </p>

      <Card className="mt-6">
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-secondary-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-stone-700">{step}</p>
            </li>
          ))}
        </ol>

        <LinkButton
          href={whatsappHref}
          variant="secondary"
          size="lg"
          className="mt-6 w-full"
        >
          💬 Démarrer sur WhatsApp
        </LinkButton>
      </Card>

      <p className="mt-4 text-center text-sm text-stone-500">
        Vous préférez un formulaire classique ?{" "}
        <LinkButton href="/chauffeur/inscription" variant="ghost" size="sm">
          Inscription par formulaire
        </LinkButton>
      </p>
    </div>
  );
}
