"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { reviewDocumentAction } from "@/app/admin/chauffeurs/[id]/actions";

const STATUS_TONE: Record<string, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

export function DocumentReviewCard({
  document,
  driverProfileId,
}: {
  document: {
    id: string;
    type: "ID_CARD" | "DRIVER_LICENSE" | "PROFILE_PHOTO";
    status: string;
    rejectionReason: string | null;
  };
  driverProfileId: string;
}) {
  const [showReject, setShowReject] = useState(false);
  const approveAction = reviewDocumentAction.bind(null, document.id, driverProfileId, true);
  const rejectAction = reviewDocumentAction.bind(null, document.id, driverProfileId, false);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-800">{DOCUMENT_TYPE_LABELS[document.type]}</span>
        <Badge tone={STATUS_TONE[document.status] ?? "neutral"}>{document.status}</Badge>
      </div>

      <a
        href={`/api/files/${document.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-primary-600 underline"
      >
        Voir le fichier →
      </a>

      {document.rejectionReason && (
        <p className="text-xs text-red-600">Motif du refus : {document.rejectionReason}</p>
      )}

      <div className="mt-1 flex flex-wrap gap-2">
        <form action={approveAction}>
          <Button type="submit" size="sm" variant="secondary">
            Approuver
          </Button>
        </form>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowReject((s) => !s)}>
          Refuser
        </Button>
      </div>

      {showReject && (
        <form action={rejectAction} className="mt-2 flex gap-2">
          <Input name="reason" placeholder="Motif du refus" className="text-sm" />
          <Button type="submit" size="sm" variant="danger">
            Confirmer le refus
          </Button>
        </form>
      )}
    </div>
  );
}
