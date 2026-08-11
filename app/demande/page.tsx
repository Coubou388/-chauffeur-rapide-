import { Card } from "@/components/ui/Card";
import { ClientRequestForm } from "@/components/client/ClientRequestForm";
import { listActiveCategories } from "@/lib/services/categories";

export const metadata = { title: "Publier une demande — Chauffeur Rapide" };

export default async function ClientRequestPage() {
  const categories = await listActiveCategories();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Publier une demande
      </h1>
      <p className="mt-1 text-stone-600">
        Pas besoin de compte. Décrivez votre besoin, nous vous mettons en
        relation avec un chauffeur disponible.
      </p>

      <Card className="mt-6">
        <ClientRequestForm
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
        />
      </Card>
    </div>
  );
}
