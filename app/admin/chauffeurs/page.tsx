import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { listDriversForAdmin } from "@/lib/services/admin";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { DriverStatusBadge } from "@/components/driver/StatusBadge";
import { cx } from "@/lib/cx";

export const metadata = { title: "Vérification des chauffeurs — Admin" };

const FILTERS = [
  { value: "", label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "IN_REVIEW", label: "En vérification" },
  { value: "VALIDATED", label: "Validés" },
  { value: "REJECTED", label: "Refusés" },
];

export default async function AdminDriversPage({
  searchParams,
}: PageProps<"/admin/chauffeurs">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const drivers = await listDriversForAdmin(status || undefined);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Chauffeurs</h1>
        <LinkButton href="/admin" variant="ghost" size="sm">
          ← Tableau de bord
        </LinkButton>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/chauffeurs?status=${f.value}` : "/admin/chauffeurs"}
            className={cx(
              "rounded-full px-3 py-1.5 text-sm font-semibold",
              status === f.value ? "bg-primary-600 text-white" : "bg-stone-100 text-stone-700"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {drivers.length === 0 && <p className="text-sm text-stone-500">Aucun chauffeur.</p>}
        {drivers.map((driver) => (
          <Link key={driver.id} href={`/admin/chauffeurs/${driver.id}`}>
            <Card className="flex items-center justify-between transition-shadow hover:shadow-md">
              <div>
                <p className="font-bold text-stone-900">
                  {driver.firstName} {driver.lastName}
                </p>
                <p className="text-sm text-stone-500">
                  {driver.commune} · {driver.phone} ·{" "}
                  {driver.categories.map((c) => c.category.label).join(", ")}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {driver.documents.length} document(s) fourni(s)
                </p>
              </div>
              <DriverStatusBadge status={driver.status} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
