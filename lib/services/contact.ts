import "server-only";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/validations/shared";
import { isGuestContactAllowed, tryConsumeFreeContact } from "@/lib/billing";
import type { ContactRequestInput, BookingRequestInput } from "@/lib/validations/client";

export async function createContactRequest(params: {
  driverProfileId: string;
  input: ContactRequestInput;
  clientUserId?: string;
}) {
  const driver = await prisma.driverProfile.findUniqueOrThrow({
    where: { id: params.driverProfileId },
  });

  const unlocked = params.clientUserId
    ? await tryConsumeFreeContact(params.clientUserId)
    : isGuestContactAllowed();

  const contactRequest = await prisma.contactRequest.create({
    data: {
      driverProfileId: driver.id,
      clientUserId: params.clientUserId,
      clientName: params.input.clientName,
      clientPhone: normalizePhone(params.input.clientPhone),
      message: params.input.message || undefined,
      channel: "PLATFORM",
      unlocked,
    },
  });

  return { contactRequest, unlocked, driverPhone: unlocked ? driver.phone : null };
}

export async function createBookingRequest(params: {
  driverProfileId: string;
  input: BookingRequestInput;
  clientUserId?: string;
}) {
  await prisma.driverProfile.findUniqueOrThrow({ where: { id: params.driverProfileId } });

  return prisma.bookingRequest.create({
    data: {
      driverProfileId: params.driverProfileId,
      clientUserId: params.clientUserId,
      clientName: params.input.clientName,
      clientPhone: normalizePhone(params.input.clientPhone),
      startDate: new Date(params.input.startDate),
      endDate: params.input.endDate ? new Date(params.input.endDate) : undefined,
      durationLabel: params.input.durationLabel || undefined,
      zone: params.input.zone || undefined,
      message: params.input.message || undefined,
    },
  });
}
