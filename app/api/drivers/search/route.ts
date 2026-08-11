import { NextRequest, NextResponse } from "next/server";
import { driverSearchSchema } from "@/lib/validations/driver";
import { searchDrivers } from "@/lib/services/driverSearch";

// Endpoint public en lecture seule, réutilisable par un futur client mobile
// ou par le bot WhatsApp pour proposer des chauffeurs. Utilise la même
// logique que la page /recherche/resultats (lib/services/driverSearch.ts).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = driverSearchSchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    commune: searchParams.get("commune") ?? undefined,
    availability: searchParams.get("availability") ?? undefined,
    minExperience: searchParams.get("minExperience") ?? undefined,
    duration: searchParams.get("duration") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const result = await searchDrivers(parsed.data);
  return NextResponse.json(result);
}
