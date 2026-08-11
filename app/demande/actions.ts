"use server";

import { clientRequestSchema } from "@/lib/validations/client";
import { createClientRequest } from "@/lib/services/clientRequests";
import { getSession } from "@/lib/auth/session";

export type ClientRequestState = { status: "idle" | "success" | "error"; message?: string };

export async function submitClientRequestAction(
  _prevState: ClientRequestState,
  formData: FormData
): Promise<ClientRequestState> {
  const parsed = clientRequestSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    categoryId: formData.get("categoryId"),
    commune: formData.get("commune"),
    description: formData.get("description"),
    durationNeeded: formData.get("durationNeeded"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const session = await getSession();
  await createClientRequest({
    input: parsed.data,
    userId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  return { status: "success" };
}
