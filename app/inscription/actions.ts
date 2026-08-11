"use server";

import { redirect } from "next/navigation";
import { registerClientSchema } from "@/lib/validations/auth";
import { normalizePhone } from "@/lib/validations/shared";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { getOrCreateWallet } from "@/lib/billing";

export type RegisterClientState = { status: "idle" | "error"; message?: string };

export async function registerClientAction(
  _prevState: RegisterClientState,
  formData: FormData
): Promise<RegisterClientState> {
  const parsed = registerClientSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const phone = normalizePhone(parsed.data.phone);
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return { status: "error", message: "Ce numéro de téléphone est déjà utilisé." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      role: "CLIENT",
      phone,
      fullName: parsed.data.fullName,
      passwordHash,
    },
  });
  await getOrCreateWallet(user.id);
  await createSession({ userId: user.id, role: "CLIENT", fullName: user.fullName ?? "" });

  redirect("/mes-demandes");
}
