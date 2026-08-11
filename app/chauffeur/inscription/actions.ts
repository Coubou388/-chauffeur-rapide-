"use server";

import { redirect } from "next/navigation";
import { driverSignupSchema } from "@/lib/validations/driver";
import { PhoneAlreadyUsedError, registerDriverFromWeb } from "@/lib/services/driverOnboarding";
import { InvalidFileError, saveDriverDocument } from "@/lib/services/documents";
import { createSession } from "@/lib/auth/session";
import { DocumentType } from "@/lib/generated/prisma/enums";

export type DriverSignupState = {
  status: "idle" | "error";
  message?: string;
};

export async function registerDriverAction(
  _prevState: DriverSignupState,
  formData: FormData
): Promise<DriverSignupState> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    whatsappPhone: formData.get("whatsappPhone") || "",
    commune: formData.get("commune"),
    categoryIds: formData.getAll("categoryIds"),
    yearsExperience: formData.get("yearsExperience"),
    availability: formData.get("availability") || "AVAILABLE",
    workZones: String(formData.get("workZones") || "")
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean),
    bio: formData.get("bio") || "",
    password: formData.get("password"),
  };

  const parsed = driverSignupSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const idCard = formData.get("idCard");
  const license = formData.get("license");
  const photo = formData.get("photo");

  if (!(idCard instanceof File) || idCard.size === 0) {
    return { status: "error", message: "La pièce d'identité est requise." };
  }
  if (!(license instanceof File) || license.size === 0) {
    return { status: "error", message: "Le permis de conduire est requis." };
  }

  let driverProfileId: string;
  let userId: string;
  let fullName: string;

  try {
    const { user, driverProfile } = await registerDriverFromWeb(parsed.data);
    driverProfileId = driverProfile.id;
    userId = user.id;
    fullName = user.fullName ?? `${parsed.data.firstName} ${parsed.data.lastName}`;

    await saveDriverDocument(driverProfileId, DocumentType.ID_CARD, idCard);
    await saveDriverDocument(driverProfileId, DocumentType.DRIVER_LICENSE, license);
    if (photo instanceof File && photo.size > 0) {
      await saveDriverDocument(driverProfileId, DocumentType.PROFILE_PHOTO, photo);
    }

    await createSession({ userId, role: "DRIVER", fullName, driverProfileId });
  } catch (err) {
    if (err instanceof PhoneAlreadyUsedError || err instanceof InvalidFileError) {
      return { status: "error", message: err.message };
    }
    console.error("[registerDriverAction]", err);
    return { status: "error", message: "Une erreur est survenue. Réessayez." };
  }

  redirect("/chauffeur/dashboard?welcome=1");
}
