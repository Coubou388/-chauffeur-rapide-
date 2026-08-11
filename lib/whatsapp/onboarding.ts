import "server-only";
import { prisma } from "@/lib/prisma";
import { getWhatsAppService } from "./service";
import { registerDriverFromWhatsApp } from "@/lib/services/driverOnboarding";
import { DRIVER_CATEGORIES } from "@/lib/constants";
import type { NormalizedIncomingMessage } from "./types";

// Machine à états très simple pour l'inscription chauffeur par conversation
// WhatsApp. Chaque numéro de téléphone a une WhatsAppSession qui mémorise
// l'étape en cours et les réponses déjà collectées (payload JSON).
//
// TODO(production): gérer aussi les messages hors-scénario ("annuler",
// "aide"), les relances après inactivité, et la reprise d'une session
// interrompue au-delà d'un certain délai.

type Payload = {
  firstName?: string;
  lastName?: string;
  commune?: string;
  categoryIndex?: number;
  yearsExperience?: number;
  availability?: "AVAILABLE" | "BUSY" | "OFFLINE";
  workZones?: string;
};

type Step =
  | "START"
  | "ASK_FIRSTNAME"
  | "ASK_LASTNAME"
  | "ASK_COMMUNE"
  | "ASK_CATEGORY"
  | "ASK_EXPERIENCE"
  | "ASK_AVAILABILITY"
  | "ASK_ZONES"
  | "CONFIRM"
  | "DONE";

function categoryMenu(): string {
  return DRIVER_CATEGORIES.map((c, i) => `${i + 1}. ${c.label}`).join("\n");
}

function promptFor(step: Step, payload: Payload): string {
  switch (step) {
    case "ASK_FIRSTNAME":
      return "Bienvenue sur Chauffeur Rapide 🚗\nInscrivons votre profil chauffeur en quelques questions.\n\nQuel est votre *prénom* ?";
    case "ASK_LASTNAME":
      return "Merci. Quel est votre *nom de famille* ?";
    case "ASK_COMMUNE":
      return "Dans quelle *commune / ville* travaillez-vous principalement ? (ex: Cocody, Yopougon, Bouaké...)";
    case "ASK_CATEGORY":
      return `Quelle est votre catégorie de chauffeur ? Répondez avec le numéro :\n\n${categoryMenu()}`;
    case "ASK_EXPERIENCE":
      return "Combien d'*années d'expérience* avez-vous ? (indiquez un nombre, ex: 3)";
    case "ASK_AVAILABILITY":
      return "Êtes-vous disponible actuellement ?\n1. Disponible\n2. Occupé\n3. Indisponible";
    case "ASK_ZONES":
      return "Dans quelles *zones* acceptez-vous de travailler ? (séparez par des virgules, ex: Cocody, Plateau, Marcory)";
    case "CONFIRM": {
      const category = payload.categoryIndex !== undefined ? DRIVER_CATEGORIES[payload.categoryIndex] : undefined;
      return (
        `Récapitulatif :\n` +
        `- Nom : ${payload.firstName} ${payload.lastName}\n` +
        `- Commune : ${payload.commune}\n` +
        `- Catégorie : ${category?.label ?? "-"}\n` +
        `- Expérience : ${payload.yearsExperience} an(s)\n` +
        `- Zones : ${payload.workZones}\n\n` +
        `Répondez *OUI* pour confirmer, ou *NON* pour recommencer.`
      );
    }
    default:
      return "Merci ! Votre dossier a été créé.";
  }
}

export async function handleIncomingWhatsAppMessage(
  message: NormalizedIncomingMessage
): Promise<void> {
  const whatsapp = getWhatsAppService();
  const phone = message.from;
  const text = message.text.trim();

  let session = await prisma.whatsAppSession.findUnique({ where: { phone } });
  if (!session) {
    session = await prisma.whatsAppSession.create({
      data: { phone, state: "START", payload: {} },
    });
  }

  let step = (session.state as Step) ?? "START";
  const payload: Payload = (session.payload as Payload) ?? {};

  // On avance d'abord la machine à états en fonction du message reçu, puis
  // on envoie le prochain prompt.
  switch (step) {
    case "START":
      step = "ASK_FIRSTNAME";
      break;
    case "ASK_FIRSTNAME":
      payload.firstName = text;
      step = "ASK_LASTNAME";
      break;
    case "ASK_LASTNAME":
      payload.lastName = text;
      step = "ASK_COMMUNE";
      break;
    case "ASK_COMMUNE":
      payload.commune = text;
      step = "ASK_CATEGORY";
      break;
    case "ASK_CATEGORY": {
      const index = Number.parseInt(text, 10) - 1;
      if (Number.isNaN(index) || index < 0 || index >= DRIVER_CATEGORIES.length) {
        await whatsapp.sendMessage({
          to: phone,
          text: `Numéro invalide. ${promptFor("ASK_CATEGORY", payload)}`,
        });
        return;
      }
      payload.categoryIndex = index;
      step = "ASK_EXPERIENCE";
      break;
    }
    case "ASK_EXPERIENCE": {
      const years = Number.parseInt(text, 10);
      if (Number.isNaN(years) || years < 0) {
        await whatsapp.sendMessage({
          to: phone,
          text: `Merci d'indiquer un nombre. ${promptFor("ASK_EXPERIENCE", payload)}`,
        });
        return;
      }
      payload.yearsExperience = years;
      step = "ASK_AVAILABILITY";
      break;
    }
    case "ASK_AVAILABILITY": {
      const map: Record<string, Payload["availability"]> = {
        "1": "AVAILABLE",
        "2": "BUSY",
        "3": "OFFLINE",
      };
      const availability = map[text];
      if (!availability) {
        await whatsapp.sendMessage({
          to: phone,
          text: `Répondez 1, 2 ou 3. ${promptFor("ASK_AVAILABILITY", payload)}`,
        });
        return;
      }
      payload.availability = availability;
      step = "ASK_ZONES";
      break;
    }
    case "ASK_ZONES":
      payload.workZones = text;
      step = "CONFIRM";
      break;
    case "CONFIRM": {
      const answer = text.toLowerCase();
      if (answer === "oui" || answer === "yes" || answer === "1") {
        const category = DRIVER_CATEGORIES[payload.categoryIndex!];
        const categoryRow = await prisma.driverCategory.findUnique({
          where: { slug: category.slug },
          select: { id: true },
        });
        if (!categoryRow) {
          await whatsapp.sendMessage({
            to: phone,
            text: "Erreur interne : catégorie introuvable. Réessayez plus tard ou inscrivez-vous via le site web.",
          });
          return;
        }
        const { tempPassword } = await registerDriverFromWhatsApp({
          phone,
          firstName: payload.firstName!,
          lastName: payload.lastName!,
          commune: payload.commune!,
          categoryIds: [categoryRow.id],
          yearsExperience: payload.yearsExperience!,
          availability: payload.availability!,
          workZones: payload.workZones!.split(",").map((z) => z.trim()).filter(Boolean),
        });
        step = "DONE";
        await prisma.whatsAppSession.update({
          where: { phone },
          data: { state: step, payload: {} },
        });
        await whatsapp.sendMessage({
          to: phone,
          text:
            `Votre dossier a été créé ✅ Statut : en attente de vérification.\n\n` +
            `Pour finaliser (photo, pièce d'identité, permis) et suivre votre statut, ` +
            `connectez-vous sur le site avec :\n` +
            `- Téléphone : ${phone}\n` +
            `- Mot de passe temporaire : ${tempPassword}\n\n` +
            `Pensez à changer ce mot de passe depuis votre tableau de bord.`,
        });
        return;
      }
      if (answer === "non" || answer === "no" || answer === "2") {
        step = "ASK_FIRSTNAME";
        await prisma.whatsAppSession.update({
          where: { phone },
          data: { state: step, payload: {} },
        });
        await whatsapp.sendMessage({ to: phone, text: promptFor(step, {}) });
        return;
      }
      await whatsapp.sendMessage({
        to: phone,
        text: `Répondez OUI ou NON.\n\n${promptFor("CONFIRM", payload)}`,
      });
      return;
    }
    case "DONE":
      await whatsapp.sendMessage({
        to: phone,
        text: "Votre dossier est déjà enregistré. Connectez-vous sur le site pour le suivre.",
      });
      return;
  }

  await prisma.whatsAppSession.update({
    where: { phone },
    data: { state: step, payload: payload as object },
  });
  await whatsapp.sendMessage({ to: phone, text: promptFor(step, payload) });
}
