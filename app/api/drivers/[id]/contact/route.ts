import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/validations/client";
import { createContactRequest } from "@/lib/services/contact";
import { getSession } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/drivers/[id]/contact">
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const session = await getSession();
  const result = await createContactRequest({
    driverProfileId: id,
    input: parsed.data,
    clientUserId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  return NextResponse.json(
    { unlocked: result.unlocked, phone: result.unlocked ? result.driverPhone : null },
    { status: 201 }
  );
}
