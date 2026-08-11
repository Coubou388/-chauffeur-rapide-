import { requireRole } from "@/lib/auth/guards";
import {
  listBookingRequestsForAdmin,
  listContactRequestsForAdmin,
} from "@/lib/services/admin";
import { listClientRequests } from "@/lib/services/clientRequests";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { REQUEST_STATUS_LABELS } from "@/lib/constants";

export const metadata = { title: "Demandes clients — Admin" };

export default async function AdminRequestsPage() {
  await requireRole("ADMIN");
  const [clientRequests, contactRequests, bookingRequests] = await Promise.all([
    listClientRequests(),
    listContactRequestsForAdmin(),
    listBookingRequestsForAdmin(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Demandes clients</h1>
        <LinkButton href="/admin" variant="ghost" size="sm">
          ← Tableau de bord
        </LinkButton>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-bold text-stone-900">Demandes publiées (libres)</h2>
        <div className="flex flex-col gap-2">
          {clientRequests.length === 0 && <p className="text-sm text-stone-500">Aucune demande.</p>}
          {clientRequests.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-900">
                    {r.fullName} · {r.phone}
                  </p>
                  <p className="text-sm text-stone-600">{r.description}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {r.category?.label ?? "Catégorie non précisée"} ·{" "}
                    {r.commune ?? "Commune non précisée"} ·{" "}
                    {r.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Badge tone="info">{REQUEST_STATUS_LABELS[r.status]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-bold text-stone-900">Mises en contact</h2>
        <div className="flex flex-col gap-2">
          {contactRequests.length === 0 && <p className="text-sm text-stone-500">Aucune demande.</p>}
          {contactRequests.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">
                  {r.clientName} → {r.driverProfile.firstName} {r.driverProfile.lastName}
                </p>
                <p className="text-xs text-stone-400">{r.createdAt.toLocaleDateString("fr-FR")}</p>
              </div>
              <Badge tone={r.unlocked ? "success" : "warning"}>
                {r.unlocked ? "Débloqué" : "Verrouillé"}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-bold text-stone-900">Réservations</h2>
        <div className="flex flex-col gap-2">
          {bookingRequests.length === 0 && <p className="text-sm text-stone-500">Aucune réservation.</p>}
          {bookingRequests.map((r) => (
            <Card key={r.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-900">
                  {r.clientName} → {r.driverProfile.firstName} {r.driverProfile.lastName}
                </p>
                <p className="text-xs text-stone-400">
                  Départ le {r.startDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Badge tone="info">{REQUEST_STATUS_LABELS[r.status]}</Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
