"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import {
  markInReviewAction,
  rejectDriverAction,
  validateDriverAction,
  type SimpleState,
} from "@/app/admin/chauffeurs/[id]/actions";

const initialState: SimpleState = { status: "idle" };

export function DriverReviewActions({ driverProfileId, status }: { driverProfileId: string; status: string }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectState, rejectAction] = useActionState(
    rejectDriverAction.bind(null, driverProfileId),
    initialState
  );
  const validate = validateDriverAction.bind(null, driverProfileId);
  const markInReview = markInReviewAction.bind(null, driverProfileId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {status === "PENDING" && (
          <form action={markInReview}>
            <Button type="submit" variant="outline">
              Marquer « en vérification »
            </Button>
          </form>
        )}
        {status !== "VALIDATED" && (
          <form action={validate}>
            <Button type="submit" variant="secondary">
              ✓ Valider le profil
            </Button>
          </form>
        )}
        {status !== "REJECTED" && (
          <Button type="button" variant="danger" onClick={() => setShowReject((s) => !s)}>
            ✕ Refuser le profil
          </Button>
        )}
      </div>

      {showReject && (
        <form action={rejectAction} className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
          {rejectState.status === "error" && <Alert tone="error">{rejectState.message}</Alert>}
          <Textarea name="reason" required placeholder="Motif du refus (visible par le chauffeur)" />
          <Button type="submit" variant="danger" className="self-start">
            Confirmer le refus
          </Button>
        </form>
      )}
    </div>
  );
}
