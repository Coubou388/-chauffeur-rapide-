import { NextRequest, NextResponse } from "next/server";
import { clientRequestSchema } from "@/lib/validations/client";
import { createClientRequest } from "@/lib/services/clientRequests";
import { getSession } from "@/lib/auth/session";

// Équivalent API du formulaire /demande — utile pour une future app mobile
// ou une intégration tierce (le formulaire web utilise le Server Action
// correspondant, voir app/demande/actions.ts, sur la même logique métier).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = clientRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const session = await getSession();
  const clientRequest = await createClientRequest({
    input: parsed.data,
    userId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  return NextResponse.json(clientRequest, { status: 201 });
}
