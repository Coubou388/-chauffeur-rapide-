import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { getDriverForAdmin } from "@/lib/services/admin";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { AvailabilityBadge, DriverStatusBadge } from "@/components/driver/StatusBadge";
import { DocumentReviewCard } from "@/components/admin/DocumentReviewCard";
import { DriverReviewActions } from "@/components/admin/DriverReviewActions";

export const metadata = { title: "Dossier chauffeur — Admin" };

export default async function AdminDriverDetailPage({
  params,
}: PageProps<"/admin/chauffeurs/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const driver = await getDriverForAdmin(id);
  if (!driver) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <LinkButton href="/admin/chauffeurs" variant="ghost" size="sm">
        ← Tous les chauffeurs
      </LinkButton>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-stone-900">
              {driver.firstName} {driver.lastName}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {driver.phone} · {driver.user.email ?? "pas d'email"}
            </p>
            <p className="text-sm text-stone-500">
              {driver.commune}, {driver.city} · {driver.yearsExperience} an(s)
              d&apos;expérience
            </p>
          </div>
          <DriverStatusBadge status={driver.status} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <AvailabilityBadge availability={driver.availability} />
          <span className="text-xs text-stone-400">
            Inscrit le {driver.createdAt.toLocaleDateString("fr-FR")} · source :{" "}
            {driver.source === "WHATSAPP" ? "WhatsApp" : "Site web"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {driver.categories.map((c) => (
            <span
              key={c.categoryId}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
            >
              {c.category.label}
            </span>
          ))}
        </div>

        {driver.workZones.length > 0 && (
          <p className="mt-2 text-sm text-stone-600">Zones : {driver.workZones.join(", ")}</p>
        )}
        {driver.bio && <p className="mt-2 text-sm text-stone-700">{driver.bio}</p>}
      </Card>

      <section className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Documents</h2>
        <div className="flex flex-col gap-3">
          {driver.documents.length === 0 && (
            <p className="text-sm text-stone-500">Aucun document fourni pour le moment.</p>
          )}
          {driver.documents.map((doc) => (
            <DocumentReviewCard
              key={doc.id}
              document={{
                id: doc.id,
                type: doc.type,
                status: doc.status,
                rejectionReason: doc.rejectionReason,
              }}
              driverProfileId={driver.id}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Décision</h2>
        <DriverReviewActions driverProfileId={driver.id} status={driver.status} />
      </section>
    </div>
  );
}
