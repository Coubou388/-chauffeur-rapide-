import Link from "next/link";
import { searchDrivers } from "@/lib/services/driverSearch";
import { driverSearchSchema } from "@/lib/validations/driver";
import { DriverCard } from "@/components/driver/DriverCard";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Résultats de recherche — Chauffeur Rapide" };

export default async function SearchResultsPage({
  searchParams,
}: PageProps<"/recherche/resultats">) {
  const params = await searchParams;
  const parsed = driverSearchSchema.safeParse({
    category: typeof params.category === "string" ? params.category : undefined,
    commune: typeof params.commune === "string" ? params.commune : undefined,
    availability: typeof params.availability === "string" ? params.availability : undefined,
    minExperience: typeof params.minExperience === "string" ? params.minExperience : undefined,
    duration: typeof params.duration === "string" ? params.duration : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
  });

  const filters = parsed.success ? parsed.data : { page: 1 };
  const { drivers, total, page, totalPages } = await searchDrivers(filters);

  function pageHref(targetPage: number) {
    const qs = new URLSearchParams();
    if (filters.category) qs.set("category", filters.category);
    if (filters.commune) qs.set("commune", filters.commune);
    if (filters.availability) qs.set("availability", filters.availability);
    if (filters.minExperience !== undefined) qs.set("minExperience", String(filters.minExperience));
    qs.set("page", String(targetPage));
    return `/recherche/resultats?${qs.toString()}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-stone-900">
          {total} chauffeur{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
        </h1>
        <LinkButton href="/recherche" variant="outline" size="sm">
          Modifier la recherche
        </LinkButton>
      </div>

      {drivers.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="text-stone-700">
            Aucun chauffeur ne correspond à ces critères pour le moment.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Essayez d&apos;élargir votre recherche, ou{" "}
            <Link href="/demande" className="font-semibold text-primary-600 underline">
              publiez une demande
            </Link>{" "}
            pour être contacté dès qu&apos;un chauffeur est disponible.
          </p>
        </Card>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {drivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && (
            <LinkButton href={pageHref(page - 1)} variant="outline" size="sm">
              ← Précédent
            </LinkButton>
          )}
          <span className="text-sm text-stone-500">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <LinkButton href={pageHref(page + 1)} variant="outline" size="sm">
              Suivant →
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
}
