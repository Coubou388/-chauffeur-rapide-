import "server-only";
import { prisma } from "@/lib/prisma";

export async function listActiveCategories() {
  return prisma.driverCategory.findMany({
    where: { active: true },
    orderBy: { label: "asc" },
  });
}

export async function listAllCategories() {
  return prisma.driverCategory.findMany({ orderBy: { label: "asc" } });
}

function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les accents (marques diacritiques)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(params: { label: string; description?: string }) {
  return prisma.driverCategory.create({
    data: {
      label: params.label,
      slug: slugify(params.label),
      description: params.description,
    },
  });
}

export async function toggleCategoryActive(id: string, active: boolean) {
  return prisma.driverCategory.update({ where: { id }, data: { active } });
}
