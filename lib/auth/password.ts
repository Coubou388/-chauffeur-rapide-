import bcrypt from "bcryptjs";

// bcryptjs : implémentation pure JS de bcrypt, aucune compilation native
// requise (contrairement à `bcrypt`). Suffisant pour un MVP.
const SALT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
