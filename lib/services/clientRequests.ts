import "server-only";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/validations/shared";
import type { ClientRequestInput } from "@/lib/validations/client";

export async function createClientRequest(params: {
  input: ClientRequestInput;
  userId?: string;
}) {
  return prisma.clientRequest.create({
    data: {
      userId: params.userId,
      fullName: params.input.fullName,
      phone: normalizePhone(params.input.phone),
      categoryId: params.input.categoryId || undefined,
      commune: params.input.commune || undefined,
      description: params.input.description,
      durationNeeded: params.input.durationNeeded || undefined,
    },
  });
}

export async function listClientRequests() {
  return prisma.clientRequest.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}
