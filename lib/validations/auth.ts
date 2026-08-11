import { z } from "zod";
import { phoneSchema } from "./shared";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Renseignez votre téléphone ou email"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerClientSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis"),
  phone: phoneSchema,
  password: z.string().min(6, "6 caractères minimum"),
});

export type RegisterClientInput = z.infer<typeof registerClientSchema>;
