import { Field, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { listActiveCategories } from "@/lib/services/categories";
import { COMMUNES } from "@/lib/constants";

export const metadata = { title: "Rechercher un chauffeur — Chauffeur Rapide" };

export default async function SearchPage() {
  const categories = await listActiveCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Trouver un chauffeur
      </h1>
      <p className="mt-1 text-stone-600">
        Remplissez ce que vous savez — tous les champs sont facultatifs.
      </p>

      <Card className="mt-6">
        <form action="/recherche/resultats" method="get" className="flex flex-col gap-5">
          <Field label="Catégorie de chauffeur" htmlFor="category">
            <Select id="category" name="category" defaultValue="">
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Commune / ville" htmlFor="commune">
            <Select id="commune" name="commune" defaultValue="">
              <option value="">Toutes les communes</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Disponibilité" htmlFor="availability">
            <Select id="availability" name="availability" defaultValue="">
              <option value="">Peu importe</option>
              <option value="AVAILABLE">Disponible maintenant</option>
              <option value="BUSY">Occupé</option>
              <option value="OFFLINE">Indisponible</option>
            </Select>
          </Field>

          <Field label="Durée du besoin" htmlFor="duration">
            <Select id="duration" name="duration" defaultValue="">
              <option value="">Peu importe</option>
              <option value="quelques-heures">Quelques heures</option>
              <option value="une-journee">Une journée</option>
              <option value="plusieurs-jours">Plusieurs jours</option>
              <option value="long-terme">Long terme (mensuel et plus)</option>
            </Select>
          </Field>

          <Field label="Expérience minimum" htmlFor="minExperience">
            <Select id="minExperience" name="minExperience" defaultValue="">
              <option value="">Peu importe</option>
              <option value="1">1 an et plus</option>
              <option value="3">3 ans et plus</option>
              <option value="5">5 ans et plus</option>
              <option value="10">10 ans et plus</option>
            </Select>
          </Field>

          <Button type="submit" size="lg">
            Rechercher
          </Button>
        </form>
      </Card>
    </div>
  );
}
