import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DriverSignupForm } from "@/components/driver/DriverSignupForm";
import { listActiveCategories } from "@/lib/services/categories";

export const metadata = { title: "Inscription chauffeur — Chauffeur Rapide" };

export default async function DriverSignupPage() {
  const categories = await listActiveCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Devenir chauffeur sur Chauffeur Rapide
      </h1>
      <p className="mt-1 text-stone-600">
        L&apos;inscription est gratuite. Comptez 5 minutes.
      </p>

      <Card className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          Vous préférez vous inscrire en discutant sur WhatsApp ?
        </p>
        <Link
          href="/chauffeur/inscription/whatsapp"
          className="whitespace-nowrap text-sm font-bold text-secondary-700 underline"
        >
          Démarrer sur WhatsApp →
        </Link>
      </Card>

      <Card className="mt-6">
        <DriverSignupForm
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
        />
      </Card>

      <p className="mt-4 text-center text-sm text-stone-500">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-semibold text-primary-600 underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
