import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { listActiveCategories } from "@/lib/services/categories";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { DriverProfileEditForm } from "@/components/driver/DriverProfileEditForm";

export const metadata = { title: "Modifier mon profil — Chauffeur Rapide" };

export default async function EditDriverProfilePage() {
  const session = await requireRole("DRIVER");

  const [profile, categories] = await Promise.all([
    prisma.driverProfile.findUnique({
      where: { userId: session.userId },
      include: { categories: true },
    }),
    listActiveCategories(),
  ]);
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Modifier mon profil</h1>
        <LinkButton href="/chauffeur/dashboard" variant="ghost" size="sm">
          ← Retour
        </LinkButton>
      </div>

      <Card className="mt-6">
        <DriverProfileEditForm
          categories={categories.map((c) => ({ id: c.id, label: c.label }))}
          profile={{
            commune: profile.commune,
            yearsExperience: profile.yearsExperience,
            workZones: profile.workZones,
            bio: profile.bio,
            categoryIds: profile.categories.map((c) => c.categoryId),
          }}
        />
      </Card>
    </div>
  );
}
