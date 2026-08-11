import { z } from "zod";
import { phoneSchema } from "./shared";

export const clientRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis"),
  phone: phoneSchema,
  categoryId: z.string().optional().or(z.literal("")),
  commune: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(10, "Décrivez votre besoin (10 caractères minimum)")
    .max(1000),
  durationNeeded: z.string().optional().or(z.literal("")),
});

export type ClientRequestInput = z.infer<typeof clientRequestSchema>;

export const contactRequestSchema = z.object({
  clientName: z.string().trim().min(2, "Nom requis"),
  clientPhone: phoneSchema,
  message: z.string().max(500).optional().or(z.literal("")),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const bookingRequestSchema = z.object({
  clientName: z.string().trim().min(2, "Nom requis"),
  clientPhone: phoneSchema,
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional().or(z.literal("")),
  durationLabel: z.string().optional().or(z.literal("")),
  zone: z.string().optional().or(z.literal("")),
  message: z.string().max(500).optional().or(z.literal("")),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
