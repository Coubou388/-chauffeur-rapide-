import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { getDriverDashboardData } from "@/lib/services/driverDashboard";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AvailabilityBadge, DriverStatusBadge } from "@/components/driver/StatusBadge";
import { DocumentUploadForm } from "@/components/driver/DocumentUploadForm";
import { Alert } from "@/components/ui/Alert";
import { updateAvailabilityAction } from "./actions";

export const metadata = { title: "Tableau de bord chauffeur — Chauffeur Rapide" };

export default async function DriverDashboardPage({
  searchParams,
}: PageProps<"/chauffeur/dashboard">) {
  const session = await requireRole("DRIVER");
  const sp = await searchParams;

  const profileRow = await prisma.driverProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profileRow) notFound();

  const { profile, viewsCount, contactsCount, bookingsCount, recentContacts, recentBookings } =
    await getDriverDashboardData(profileRow.id);
  if (!profile) notFound();

  const documentByType = Object.fromEntries(profile.documents.map((d) => [d.type, d]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            Bonjour {profile.firstName} 👋
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <DriverStatusBadge status={profile.status} />
            <AvailabilityBadge availability={profile.availability} />
          </div>
        </div>
        <LogoutButton />
      </div>

      {sp.welcome === "1" && (
        <Alert tone="success" className="mt-4">
          Bienvenue ! Votre dossier a été créé et est en attente de
          vérification par notre équipe.
        </Alert>
      )}
      {profile.status === "REJECTED" && (
        <Alert tone="error" className="mt-4">
          Votre dossier a été refusé
          {profile.rejectionReason ? ` : ${profile.rejectionReason}` : "."} Vous
          pouvez corriger vos documents ci-dessous pour le soumettre à
          nouveau.
        </Alert>
      )}

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-primary-600">{viewsCount}</p>
          <p className="text-xs text-stone-500">Vues du profil</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-primary-600">{contactsCount}</p>
          <p className="text-xs text-stone-500">Contacts reçus</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-primary-600">{bookingsCount}</p>
          <p className="text-xs text-stone-500">Demandes reçues</p>
        </Card>
      </div>

      {/* Disponibilité */}
      <Card className="mt-6">
        <h2 className="font-bold text-stone-900">Ma disponibilité</h2>
        <form action={updateAvailabilityAction} className="mt-3 flex flex-wrap items-center gap-2">
          <select
            name="availability"
            defaultValue={profile.availability}
            className="rounded-xl border-2 border-stone-300 px-3 py-2 text-sm"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="BUSY">Occupé</option>
            <option value="OFFLINE">Indisponible</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Mettre à jour
          </button>
        </form>
      </Card>

      {/* Profil */}
      <Card className="mt-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-stone-900">Mon profil</h2>
          <p className="text-sm text-stone-500">
            {profile.commune} · {profile.yearsExperience} an(s) ·{" "}
            {profile.categories.map((c) => c.category.label).join(", ")}
          </p>
        </div>
        <LinkButton href="/chauffeur/dashboard/profil" variant="outline" size="sm">
          Modifier
        </LinkButton>
      </Card>

      {/* Documents */}
      <section className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Mes documents</h2>
        <div className="flex flex-col gap-3">
          <DocumentUploadForm
            type="ID_CARD"
            status={documentByType["ID_CARD"]?.status}
            rejectionReason={documentByType["ID_CARD"]?.rejectionReason}
          />
          <DocumentUploadForm
            type="DRIVER_LICENSE"
            status={documentByType["DRIVER_LICENSE"]?.status}
            rejectionReason={documentByType["DRIVER_LICENSE"]?.rejectionReason}
          />
          <DocumentUploadForm
            type="PROFILE_PHOTO"
            status={documentByType["PROFILE_PHOTO"]?.status}
          />
        </div>
      </section>

      {/* Demandes récentes */}
      <section className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Contacts récents</h2>
        <div className="flex flex-col gap-2">
          {recentContacts.length === 0 && (
            <p className="text-sm text-stone-500">Aucun contact pour le moment.</p>
          )}
          {recentContacts.map((c) => (
            <Card key={c.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">{c.clientName}</p>
                <p className="text-xs text-stone-500">{c.clientPhone}</p>
              </div>
              <p className="text-xs text-stone-400">{c.createdAt.toLocaleDateString("fr-FR")}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Réservations récentes</h2>
        <div className="flex flex-col gap-2">
          {recentBookings.length === 0 && (
            <p className="text-sm text-stone-500">Aucune réservation pour le moment.</p>
          )}
          {recentBookings.map((b) => (
            <Card key={b.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">{b.clientName}</p>
                <p className="text-xs text-stone-500">
                  Départ le {b.startDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="text-xs text-stone-400">{b.clientPhone}</p>
            </Card>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-stone-500">
        Besoin d&apos;aide ?{" "}
        <Link href="/mentions-legales" className="underline">
          Consultez nos mentions légales
        </Link>
      </p>
    </div>
  );
}
