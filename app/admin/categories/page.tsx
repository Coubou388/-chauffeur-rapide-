import { requireRole } from "@/lib/auth/guards";
import { listAllCategories } from "@/lib/services/categories";
import { Card } from "@/components/ui/Card";
import { LinkButton, Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { toggleCategoryAction } from "./actions";

export const metadata = { title: "Catégories — Admin" };

export default async function AdminCategoriesPage() {
  await requireRole("ADMIN");
  const categories = await listAllCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-stone-900">Catégories</h1>
        <LinkButton href="/admin" variant="ghost" size="sm">
          ← Tableau de bord
        </LinkButton>
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-bold text-stone-900">Ajouter une catégorie</h2>
        <CategoryForm />
      </Card>

      <div className="mt-6 flex flex-col gap-2">
        {categories.map((cat) => (
          <Card key={cat.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-900">{cat.label}</p>
              {cat.description && <p className="text-sm text-stone-500">{cat.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={cat.active ? "success" : "neutral"}>
                {cat.active ? "Active" : "Désactivée"}
              </Badge>
              <form action={toggleCategoryAction.bind(null, cat.id, !cat.active)}>
                <Button type="submit" variant="outline" size="sm">
                  {cat.active ? "Désactiver" : "Activer"}
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
