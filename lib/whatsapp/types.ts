// Abstraction du canal WhatsApp. Aucune intégration réelle avec l'API Meta
// Cloud n'est branchée dans ce MVP (voir TODO dans service.ts) — mais toute
// la mécanique (état de conversation, envoi de messages, webhook) est en
// place pour brancher un vrai provider sans réécrire la logique métier.

export interface OutgoingMessage {
  to: string; // numéro au format international, ex: 2250700000000
  text: string;
}

export interface WhatsAppService {
  sendMessage(message: OutgoingMessage): Promise<void>;
}

// Payload générique reçu du webhook, déjà normalisé (indépendant du format
// brut Meta Cloud API) pour que la machine à états n'ait pas à en connaître
// les détails.
export interface NormalizedIncomingMessage {
  from: string; // numéro de l'expéditeur
  text: string; // contenu texte du message
}
