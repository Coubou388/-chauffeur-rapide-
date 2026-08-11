import "server-only";
import { prisma } from "@/lib/prisma";
import { FREE_CONTACTS_PER_CLIENT } from "@/lib/constants";

// Abstraction de facturation. Le MVP ne branche aucun paiement réel : il se
// contente d'un quota de crédits gratuits par client (CreditWallet), et
// marque les demandes de contact au-delà du quota comme "non débloquées".
//
// TODO(production): brancher un vrai fournisseur de paiement adapté au
// marché ivoirien (CinetPay, Wave, Orange Money...) ou Stripe pour les
// paiements internationaux. Prévoir alors :
//   - un modèle `Plan` (offres : pack de contacts, abonnement entreprise)
//   - un modèle `Payment` / `Order` avec statut (pending/paid/failed)
//   - un webhook de confirmation de paiement qui appelle `unlockContact()`
//     ci-dessous une fois le paiement confirmé.

export async function getOrCreateWallet(userId: string) {
  const existing = await prisma.creditWallet.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.creditWallet.create({
    data: { userId, freeContactsRemaining: FREE_CONTACTS_PER_CLIENT },
  });
}

/**
 * Tente de consommer un crédit de contact gratuit pour cet utilisateur.
 * Renvoie true si un crédit a été consommé (contact débloqué), false si le
 * quota est épuisé (le contact reste verrouillé, en attente d'achat).
 */
export async function tryConsumeFreeContact(userId: string): Promise<boolean> {
  const wallet = await getOrCreateWallet(userId);
  if (wallet.freeContactsRemaining <= 0) return false;
  await prisma.creditWallet.update({
    where: { userId },
    data: { freeContactsRemaining: { decrement: 1 } },
  });
  return true;
}

// Utilisateurs anonymes (sans compte) : on offre toujours l'accès pour ne
// pas bloquer la conversion en MVP — l'incitation à créer un compte se fait
// via l'UI, pas via un blocage dur. TODO(production): limiter par IP/session.
export function isGuestContactAllowed(): boolean {
  return true;
}
