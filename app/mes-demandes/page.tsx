import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { REQUEST_STATUS_LABELS } from "@/lib/constants";

export const metadata = { title: "Mes demandes — Chauffeur Rapide" };

export default async function MyRequestsPage() {
  const session = await requireRole("CLIENT");

  const [contactRequests, bookingRequests, clientRequests, wallet] = await Promise.all([
    prisma.contactRequest.findMany({
      where: { clientUserId: session.userId },
      include: { driverProfile: { select: { firstName: true, lastName: true, id: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bookingRequest.findMany({
      where: { clientUserId: session.userId },
      include: { driverProfile: { select: { firstName: true, lastName: true, id: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.clientRequest.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.creditWallet.findUnique({ where: { userId: session.userId } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Mes demandes</h1>
        <LogoutButton />
      </div>

      <Card className="mt-6">
        <p className="text-sm text-stone-600">
          Crédits de contact gratuits restants :{" "}
          <span className="font-bold text-primary-600">
            {wallet?.freeContactsRemaining ?? 0}
          </span>
        </p>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-900">Mises en contact</h2>
        <div className="mt-3 flex flex-col gap-3">
          {contactRequests.length === 0 && (
            <p className="text-sm text-stone-500">Aucune demande pour le moment.</p>
          )}
          {contactRequests.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">
                  {r.driverProfile.firstName} {r.driverProfile.lastName.charAt(0)}.
                </p>
                <p className="text-xs text-stone-500">{r.createdAt.toLocaleDateString("fr-FR")}</p>
              </div>
              <Badge tone={r.unlocked ? "success" : "warning"}>
                {r.unlocked ? "Débloqué" : "En attente de déblocage"}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-900">Réservations</h2>
        <div className="mt-3 flex flex-col gap-3">
          {bookingRequests.length === 0 && (
            <p className="text-sm text-stone-500">Aucune réservation pour le moment.</p>
          )}
          {bookingRequests.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">
                  {r.driverProfile.firstName} {r.driverProfile.lastName.charAt(0)}.
                </p>
                <p className="text-xs text-stone-500">
                  Départ : {r.startDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Badge tone="info">{REQUEST_STATUS_LABELS[r.status]}</Badge>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-900">Demandes publiées</h2>
        <div className="mt-3 flex flex-col gap-3">
          {clientRequests.length === 0 && (
            <p className="text-sm text-stone-500">Aucune demande publiée pour le moment.</p>
          )}
          {clientRequests.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">{r.description.slice(0, 60)}</p>
                <p className="text-xs text-stone-500">{r.createdAt.toLocaleDateString("fr-FR")}</p>
              </div>
              <Badge tone="info">{REQUEST_STATUS_LABELS[r.status]}</Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
