import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getDriverProfileById, recordProfileView } from "@/lib/services/driverSearch";
import { getSession } from "@/lib/auth/session";
import { AvailabilityBadge, DriverStatusBadge } from "@/components/driver/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ContactForm } from "@/components/driver/ContactForm";
import { BookingForm } from "@/components/driver/BookingForm";
import { DRIVER_STATUS_LABELS } from "@/lib/constants";

export const metadata = { title: "Profil chauffeur — Chauffeur Rapide" };

export default async function DriverProfilePage({ params }: PageProps<"/chauffeurs/[id]">) {
  const { id } = await params;
  const driver = await getDriverProfileById(id);
  if (!driver) notFound();

  const session = await getSession();
  const headerList = await headers();
  await recordProfileView({
    driverProfileId: id,
    viewerUserId: session?.userId,
    viewerIp: headerList.get("x-forwarded-for") ?? undefined,
  });

  const isVerified = driver.status === "VALIDATED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              {driver.firstName} {driver.lastName.charAt(0)}.
            </h1>
            <p className="mt-1 text-stone-500">
              {driver.commune}, {driver.city} · {driver.yearsExperience} an(s)
              d&apos;expérience
            </p>
          </div>
          <DriverStatusBadge status={driver.status} />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <AvailabilityBadge availability={driver.availability} />
          {driver.workZones.length > 0 && (
            <span className="text-sm text-stone-500">
              Zones : {driver.workZones.join(", ")}
            </span>
          )}
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

        {driver.bio && <p className="mt-4 text-stone-700">{driver.bio}</p>}

        {!isVerified && (
          <Alert tone="info" className="mt-4">
            Ce profil n&apos;a pas encore été vérifié par notre équipe
            (statut : {DRIVER_STATUS_LABELS[driver.status]}). Les
            coordonnées complètes sont communiquées après validation de la
            demande de contact.
          </Alert>
        )}
      </Card>

      <details className="mt-6 group">
        <summary className="cursor-pointer list-none">
          <Card className="flex items-center justify-between">
            <span className="font-bold text-stone-900">📞 Contacter ce chauffeur</span>
            <span className="text-primary-600 transition-transform group-open:rotate-180">▾</span>
          </Card>
        </summary>
        <Card className="mt-2">
          <ContactForm driverId={driver.id} />
        </Card>
      </details>

      <details className="mt-4 group">
        <summary className="cursor-pointer list-none">
          <Card className="flex items-center justify-between">
            <span className="font-bold text-stone-900">📅 Réserver ce chauffeur</span>
            <span className="text-primary-600 transition-transform group-open:rotate-180">▾</span>
          </Card>
        </summary>
        <Card className="mt-2">
          <BookingForm driverId={driver.id} />
        </Card>
      </details>
    </div>
  );
}
