import "server-only";
import type { OutgoingMessage, WhatsAppService } from "./types";

// Implémentation "mock" : logue le message au lieu de l'envoyer réellement.
// Suffisant pour développer/démontrer la machine à états de conversation
// sans dépendre d'un compte WhatsApp Business.
class MockWhatsAppService implements WhatsAppService {
  async sendMessage(message: OutgoingMessage): Promise<void> {
    console.log(`[WhatsApp:mock] -> ${message.to}: ${message.text}`);
  }
}

// TODO(production): implémenter un provider réel, par ex. via l'API Meta
// Cloud (https://developers.facebook.com/docs/whatsapp/cloud-api) :
//
// class MetaCloudWhatsAppService implements WhatsAppService {
//   async sendMessage({ to, text }: OutgoingMessage) {
//     await fetch(
//       `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messaging_product: "whatsapp",
//           to,
//           type: "text",
//           text: { body: text },
//         }),
//       }
//     );
//   }
// }

let instance: WhatsAppService | null = null;

export function getWhatsAppService(): WhatsAppService {
  if (!instance) {
    // process.env.WHATSAPP_PROVIDER === "meta-cloud" -> brancher le vrai provider ici.
    instance = new MockWhatsAppService();
  }
  return instance;
}
