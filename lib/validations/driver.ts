import { z } from "zod";
import { phoneSchema } from "./shared";

export const driverSignupSchema = z.object({
  firstName: z.string().trim().min(2, "Prénom trop court"),
  lastName: z.string().trim().min(2, "Nom trop court"),
  phone: phoneSchema,
  whatsappPhone: z
    .union([phoneSchema, z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  commune: z.string().trim().min(2, "Commune requise"),
  categoryIds: z
    .array(z.string())
    .min(1, "Choisissez au moins une catégorie"),
  yearsExperience: z.coerce
    .number()
    .int("Nombre entier requis")
    .min(0, "Doit être positif")
    .max(60, "Valeur trop élevée"),
  availability: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]).default("AVAILABLE"),
  workZones: z.array(z.string()).min(1, "Indiquez au moins une zone"),
  bio: z
    .string()
    .max(500, "500 caractères maximum")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "6 caractères minimum"),
});

export type DriverSignupInput = z.infer<typeof driverSignupSchema>;

export const driverProfileUpdateSchema = z.object({
  commune: z.string().trim().min(2, "Commune requise"),
  categoryIds: z
    .array(z.string())
    .min(1, "Choisissez au moins une catégorie"),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  workZones: z.array(z.string()).min(1, "Indiquez au moins une zone"),
  bio: z.string().max(500).optional().or(z.literal("")),
});

export type DriverProfileUpdateInput = z.infer<typeof driverProfileUpdateSchema>;

export const availabilitySchema = z.object({
  availability: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]),
});

export const driverSearchSchema = z.object({
  category: z.string().optional(),
  commune: z.string().optional(),
  availability: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]).optional(),
  minExperience: z.coerce.number().int().min(0).optional(),
  duration: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type DriverSearchInput = z.infer<typeof driverSearchSchema>;
