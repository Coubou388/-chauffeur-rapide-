import { requireRole } from "@/lib/auth/guards";
import { getAdminStats } from "@/lib/services/admin";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const metadata = { title: "Administration — Chauffeur Rapide" };

export default async function AdminHomePage() {
  await requireRole("ADMIN");
  const stats = await getAdminStats();

  const cards = [
    { label: "Chauffeurs inscrits", value: stats.totalDrivers },
    { label: "En attente de validation", value: stats.pendingDrivers, highlight: true },
    { label: "Chauffeurs validés", value: stats.validatedDrivers },
    { label: "Chauffeurs refusés", value: stats.rejectedDrivers },
    { label: "Demandes clients", value: stats.totalClientRequests },
    { label: "Mises en contact", value: stats.totalContactRequests },
    { label: "Réservations", value: stats.totalBookingRequests },
    { label: "Vues de profils", value: stats.totalViews },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Administration</h1>
        <LogoutButton />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className={c.highlight ? "border-primary-400 bg-primary-50" : ""}>
            <p className="text-2xl font-extrabold text-stone-900">{c.value}</p>
            <p className="text-xs text-stone-500">{c.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <LinkButton href="/admin/chauffeurs" variant="primary">
          Vérifier les chauffeurs
        </LinkButton>
        <LinkButton href="/admin/demandes" variant="outline">
          Voir les demandes clients
        </LinkButton>
        <LinkButton href="/admin/categories" variant="outline">
          Gérer les catégories
        </LinkButton>
      </div>
    </div>
  );
}
