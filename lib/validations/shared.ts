import { z } from "zod";

// Numéros ivoiriens : 10 chiffres locaux (ex: 0700000000) ou format
// international +225XXXXXXXXXX. On reste volontairement permissif pour un MVP.
export const phoneSchema = z
  .string()
  .trim()
  .min(8, "Numéro de téléphone invalide")
  .regex(/^\+?[0-9]{8,13}$/, "Numéro de téléphone invalide");

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim().replace(/[\s.-]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return `+${trimmed.slice(2)}`;
  if (trimmed.startsWith("225")) return `+${trimmed}`;
  if (trimmed.startsWith("0")) return `+225${trimmed.slice(1)}`;
  return `+225${trimmed}`;
}
