import { NextRequest, NextResponse } from "next/server";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp/onboarding";
import type { NormalizedIncomingMessage } from "@/lib/whatsapp/types";

// Webhook prêt à recevoir de vrais événements WhatsApp (Meta Cloud API),
// mais fonctionnel dès maintenant en mode "mock" pour tester la machine à
// états de bout en bout (voir README > Tester le flux WhatsApp).

// 1) Vérification du webhook par Meta (handshake GET).
// https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Vérification échouée." }, { status: 403 });
}

// 2) Réception des messages entrants.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const messages = normalizeIncoming(body);
  for (const message of messages) {
    await handleIncomingWhatsAppMessage(message);
  }

  return NextResponse.json({ received: messages.length });
}

function normalizeIncoming(body: unknown): NormalizedIncomingMessage[] {
  // Format simplifié, pratique pour tester localement :
  // { "from": "2250700000000", "text": "Bonjour" }
  if (isPlainMessage(body)) {
    return [{ from: body.from, text: body.text }];
  }

  // Format réel Meta Cloud API : entry[].changes[].value.messages[]
  const messages: NormalizedIncomingMessage[] = [];
  const entries = (body as { entry?: unknown[] })?.entry;
  if (Array.isArray(entries)) {
    for (const entry of entries) {
      const changes = (entry as { changes?: unknown[] })?.changes;
      if (!Array.isArray(changes)) continue;
      for (const change of changes) {
        const value = (change as { value?: { messages?: unknown[] } })?.value;
        const rawMessages = value?.messages;
        if (!Array.isArray(rawMessages)) continue;
        for (const m of rawMessages) {
          const from = (m as { from?: string })?.from;
          const text = (m as { text?: { body?: string } })?.text?.body;
          if (from && text) messages.push({ from, text });
        }
      }
    }
  }
  return messages;
}

function isPlainMessage(body: unknown): body is { from: string; text: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as Record<string, unknown>).from === "string" &&
    typeof (body as Record<string, unknown>).text === "string"
  );
}
