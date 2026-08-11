import { SignJWT, jwtVerify } from "jose";

// Fonctions bas niveau, sans dépendance à `next/headers`, pour pouvoir être
// utilisées aussi bien dans les Server Actions / Route Handlers (Node) que
// dans middleware.ts (Edge runtime). `jose` fonctionne dans les deux.

export type SessionRole = "CLIENT" | "DRIVER" | "ADMIN";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  fullName: string;
  driverProfileId?: string;
};

const COOKIE_NAME = "cr_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 jours

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET manquant. Copiez .env.example vers .env et renseignez une valeur."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.userId === "string" &&
      typeof payload.role === "string" &&
      typeof payload.fullName === "string"
    ) {
      return {
        userId: payload.userId,
        role: payload.role as SessionRole,
        fullName: payload.fullName,
        driverProfileId:
          typeof payload.driverProfileId === "string"
            ? payload.driverProfileId
            : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
