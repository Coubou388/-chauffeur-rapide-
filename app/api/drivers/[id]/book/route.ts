import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validations/client";
import { createBookingRequest } from "@/lib/services/contact";
import { getSession } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/drivers/[id]/book">
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const session = await getSession();
  const booking = await createBookingRequest({
    driverProfileId: id,
    input: parsed.data,
    clientUserId: session?.role === "CLIENT" ? session.userId : undefined,
  });

  return NextResponse.json(booking, { status: 201 });
}
