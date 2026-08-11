"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { availabilitySchema, driverProfileUpdateSchema } from "@/lib/validations/driver";
import { InvalidFileError, saveDriverDocument } from "@/lib/services/documents";
import { DocumentType } from "@/lib/generated/prisma/enums";

export type SimpleState = { status: "idle" | "success" | "error"; message?: string };

async function getOwnDriverProfileId(): Promise<string> {
  const session = await requireRole("DRIVER");
  const profile = await prisma.driverProfile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profile) throw new Error("Profil chauffeur introuvable.");
  return profile.id;
}

export async function updateAvailabilityAction(formData: FormData): Promise<void> {
  const driverProfileId = await getOwnDriverProfileId();
  const parsed = availabilitySchema.safeParse({ availability: formData.get("availability") });
  if (!parsed.success) return;

  await prisma.driverProfile.update({
    where: { id: driverProfileId },
    data: { availability: parsed.data.availability },
  });
  revalidatePath("/chauffeur/dashboard");
}

export async function updateDriverProfileAction(
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const driverProfileId = await getOwnDriverProfileId();

  const parsed = driverProfileUpdateSchema.safeParse({
    commune: formData.get("commune"),
    categoryIds: formData.getAll("categoryIds"),
    yearsExperience: formData.get("yearsExperience"),
    workZones: String(formData.get("workZones") || "")
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean),
    bio: formData.get("bio") || "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const validCategories = await prisma.driverCategory.findMany({
    where: { id: { in: parsed.data.categoryIds }, active: true },
    select: { id: true },
  });
  if (validCategories.length === 0) {
    return { status: "error", message: "Choisissez au moins une catégorie valide." };
  }

  await prisma.$transaction([
    prisma.driverProfileCategory.deleteMany({ where: { driverProfileId } }),
    prisma.driverProfile.update({
      where: { id: driverProfileId },
      data: {
        commune: parsed.data.commune,
        yearsExperience: parsed.data.yearsExperience,
        workZones: parsed.data.workZones,
        bio: parsed.data.bio || null,
        categories: { create: validCategories.map((c) => ({ categoryId: c.id })) },
      },
    }),
  ]);

  revalidatePath("/chauffeur/dashboard");
  return { status: "success" };
}

export async function replaceDocumentAction(
  type: (typeof DocumentType)[keyof typeof DocumentType],
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const driverProfileId = await getOwnDriverProfileId();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Sélectionnez un fichier." };
  }

  try {
    await saveDriverDocument(driverProfileId, type, file);
  } catch (err) {
    if (err instanceof InvalidFileError) {
      return { status: "error", message: err.message };
    }
    console.error("[replaceDocumentAction]", err);
    return { status: "error", message: "Une erreur est survenue." };
  }

  // Un nouveau document (identité/permis) remet le dossier en attente de
  // re-vérification s'il avait été refusé.
  await prisma.driverProfile.updateMany({
    where: { id: driverProfileId, status: "REJECTED" },
    data: { status: "PENDING", rejectionReason: null },
  });

  revalidatePath("/chauffeur/dashboard");
  return { status: "success" };
}
