import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { normalizePhone } from "@/lib/validations/shared";
import type { DriverSignupInput } from "@/lib/validations/driver";
import { DriverSource } from "@/lib/generated/prisma/enums";

// Point d'entrée partagé : appelé à la fois par le Server Action du
// formulaire web (`app/chauffeur/inscription/actions.ts`) et, plus tard, par
// la machine à états WhatsApp (`lib/whatsapp/onboarding.ts`). Toute la
// logique de création "chauffeur" vit ici pour éviter la duplication.

export class PhoneAlreadyUsedError extends Error {
  constructor() {
    super("Ce numéro de téléphone est déjà utilisé.");
  }
}

async function assertPhoneAvailable(phone: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw new PhoneAlreadyUsedError();
}

/** Inscription via le formulaire web complet (mot de passe choisi par le chauffeur). */
export async function registerDriverFromWeb(input: DriverSignupInput) {
  const phone = normalizePhone(input.phone);
  await assertPhoneAvailable(phone);
  const passwordHash = await hashPassword(input.password);

  return createDriverUserAndProfile({
    phone,
    whatsappPhone: input.whatsappPhone ? normalizePhone(input.whatsappPhone) : undefined,
    firstName: input.firstName,
    lastName: input.lastName,
    commune: input.commune,
    categoryIds: input.categoryIds,
    yearsExperience: input.yearsExperience,
    availability: input.availability,
    workZones: input.workZones,
    bio: input.bio || undefined,
    passwordHash,
    source: DriverSource.WEB,
  });
}

/**
 * Inscription initiée depuis WhatsApp : un mot de passe temporaire est généré
 * et communiqué au chauffeur (voir lib/whatsapp/onboarding.ts) afin qu'il
 * puisse se connecter au dashboard web pour terminer son dossier (upload des
 * documents, photo de profil).
 */
export async function registerDriverFromWhatsApp(params: {
  phone: string;
  firstName: string;
  lastName: string;
  commune: string;
  categoryIds: string[];
  yearsExperience: number;
  availability: "AVAILABLE" | "BUSY" | "OFFLINE";
  workZones: string[];
}) {
  const phone = normalizePhone(params.phone);
  await assertPhoneAvailable(phone);
  const tempPassword = randomBytes(4).toString("hex"); // 8 caractères, lisible à l'oral
  const passwordHash = await hashPassword(tempPassword);

  const { driverProfile } = await createDriverUserAndProfile({
    phone,
    whatsappPhone: phone,
    firstName: params.firstName,
    lastName: params.lastName,
    commune: params.commune,
    categoryIds: params.categoryIds,
    yearsExperience: params.yearsExperience,
    availability: params.availability,
    workZones: params.workZones,
    bio: undefined,
    passwordHash,
    source: DriverSource.WHATSAPP,
  });

  return { driverProfile, tempPassword };
}

async function createDriverUserAndProfile(params: {
  phone: string;
  whatsappPhone?: string;
  firstName: string;
  lastName: string;
  commune: string;
  categoryIds: string[];
  yearsExperience: number;
  availability: "AVAILABLE" | "BUSY" | "OFFLINE";
  workZones: string[];
  bio?: string;
  passwordHash: string;
  source: (typeof DriverSource)[keyof typeof DriverSource];
}) {
  const validCategories = await prisma.driverCategory.findMany({
    where: { id: { in: params.categoryIds }, active: true },
    select: { id: true },
  });
  if (validCategories.length === 0) {
    throw new Error("Aucune catégorie valide sélectionnée.");
  }

  const user = await prisma.user.create({
    data: {
      role: "DRIVER",
      phone: params.phone,
      fullName: `${params.firstName} ${params.lastName}`,
      passwordHash: params.passwordHash,
      driverProfile: {
        create: {
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone,
          whatsappPhone: params.whatsappPhone,
          commune: params.commune,
          yearsExperience: params.yearsExperience,
          availability: params.availability,
          workZones: params.workZones,
          bio: params.bio,
          source: params.source,
          categories: {
            create: validCategories.map((c) => ({ categoryId: c.id })),
          },
        },
      },
    },
    include: { driverProfile: true },
  });

  return { user, driverProfile: user.driverProfile! };
}
