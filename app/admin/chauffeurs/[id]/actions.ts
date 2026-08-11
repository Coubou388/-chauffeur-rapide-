"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import {
  markDriverInReview,
  rejectDriver,
  validateDriver,
} from "@/lib/services/admin";
import { reviewDocument } from "@/lib/services/documents";
import { DocumentStatus } from "@/lib/generated/prisma/enums";

export type SimpleState = { status: "idle" | "success" | "error"; message?: string };

export async function validateDriverAction(driverProfileId: string): Promise<void> {
  const session = await requireRole("ADMIN");
  await validateDriver({ driverProfileId, adminUserId: session.userId });
  revalidatePath(`/admin/chauffeurs/${driverProfileId}`);
  revalidatePath("/admin/chauffeurs");
}

export async function markInReviewAction(driverProfileId: string): Promise<void> {
  const session = await requireRole("ADMIN");
  await markDriverInReview({ driverProfileId, adminUserId: session.userId });
  revalidatePath(`/admin/chauffeurs/${driverProfileId}`);
  revalidatePath("/admin/chauffeurs");
}

export async function rejectDriverAction(
  driverProfileId: string,
  _prevState: SimpleState,
  formData: FormData
): Promise<SimpleState> {
  const session = await requireRole("ADMIN");
  const reason = String(formData.get("reason") || "").trim();
  if (!reason) {
    return { status: "error", message: "Indiquez un motif de refus." };
  }
  await rejectDriver({ driverProfileId, adminUserId: session.userId, reason });
  revalidatePath(`/admin/chauffeurs/${driverProfileId}`);
  revalidatePath("/admin/chauffeurs");
  return { status: "success" };
}

export async function reviewDocumentAction(
  documentId: string,
  driverProfileId: string,
  approve: boolean,
  formData: FormData
): Promise<void> {
  const session = await requireRole("ADMIN");
  const reason = String(formData.get("reason") || "").trim();
  await reviewDocument({
    documentId,
    status: approve ? DocumentStatus.APPROVED : DocumentStatus.REJECTED,
    adminUserId: session.userId,
    rejectionReason: approve ? undefined : reason || undefined,
  });
  revalidatePath(`/admin/chauffeurs/${driverProfileId}`);
}
