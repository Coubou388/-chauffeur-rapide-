"use server";

import { getSession } from "@/lib/auth/session";
import { contactRequestSchema, bookingRequestSchema } from "@/lib/validations/client";
import { createBookingRequest, createContactRequest } from "@/lib/services/contact";

export type ContactFormState = {
  status: "idle" | "success" | "locked" | "error";
  message?: string;
  phone?: string;
};

export type BookingFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// On utilise useActionState côté client plutôt qu'une redirection : le
// numéro débloqué ne doit jamais transiter par l'URL (historique navigateur,
// logs serveur...).
export async function contactDriverAction(
  driverProfileId: string,
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactRequestSchema.safeParse({
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const session = await getSession();
  const result = await createContactRequest({
    driverProfileId,
    input: parsed.data,
    clientUserId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  if (result.unlocked) {
    return { status: "success", phone: result.driverPhone ?? undefined };
  }
  return {
    status: "locked",
    message:
      "Vous avez atteint votre quota de mises en contact gratuites. Créez un compte ou contactez-nous pour en débloquer davantage.",
  };
}

export async function bookDriverAction(
  driverProfileId: string,
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const parsed = bookingRequestSchema.safeParse({
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    durationLabel: formData.get("durationLabel"),
    zone: formData.get("zone"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const session = await getSession();
  await createBookingRequest({
    driverProfileId,
    input: parsed.data,
    clientUserId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  return { status: "success" };
}
