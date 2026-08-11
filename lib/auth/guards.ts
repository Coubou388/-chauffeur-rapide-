import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { SessionPayload, SessionRole } from "./jwt";

// À utiliser en haut des pages/Server Actions protégées. `middleware.ts`
// bloque déjà l'accès non authentifié aux routes /chauffeur/dashboard et
// /admin, mais on revérifie ici (défense en profondeur + accès au payload).

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }
  return session;
}

export async function requireRole(role: SessionRole): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== role) {
    redirect("/");
  }
  return session;
}
