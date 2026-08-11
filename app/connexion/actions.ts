"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validations/auth";
import { normalizePhone } from "@/lib/validations/shared";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export type LoginState = { status: "idle" | "error"; message?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  const { identifier, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: normalizePhone(identifier) }, { email: identifier.toLowerCase() }],
    },
    include: { driverProfile: { select: { id: true } } },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { status: "error", message: "Téléphone/email ou mot de passe incorrect." };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    fullName: user.fullName ?? "",
    driverProfileId: user.driverProfile?.id,
  });

  if (user.role === "DRIVER") redirect("/chauffeur/dashboard");
  if (user.role === "ADMIN") redirect("/admin");
  redirect("/mes-demandes");
}
