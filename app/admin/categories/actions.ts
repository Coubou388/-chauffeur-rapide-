"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createCategory, toggleCategoryActive } from "@/lib/services/categories";

export type SimpleState = { status: "idle" | "success" | "error"; message?: string };

export async function createCategoryAction(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  await requireRole("ADMIN");
  const label = String(formData.get("label") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (label.length < 3) {
    return { status: "error", message: "Le nom de la catégorie est trop court." };
  }
  await createCategory({ label, description: description || undefined });
  revalidatePath("/admin/categories");
  return { status: "success" };
}

export async function toggleCategoryAction(id: string, active: boolean): Promise<void> {
  await requireRole("ADMIN");
  await toggleCategoryActive(id, active);
  revalidatePath("/admin/categories");
}
