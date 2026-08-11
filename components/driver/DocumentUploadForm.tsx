"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { replaceDocumentAction, type SimpleState } from "@/app/chauffeur/dashboard/actions";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";

const initialState: SimpleState = { status: "idle" };

const STATUS_TONE: Record<string, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  APPROVED: "Validé",
  PENDING: "En attente de vérification",
  REJECTED: "Refusé",
};

export function DocumentUploadForm({
  type,
  status,
  rejectionReason,
}: {
  type: "ID_CARD" | "DRIVER_LICENSE" | "PROFILE_PHOTO";
  status?: string;
  rejectionReason?: string | null;
}) {
  const action = replaceDocumentAction.bind(null, type);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-stone-800">{DOCUMENT_TYPE_LABELS[type]}</span>
        {status && <Badge tone={STATUS_TONE[status] ?? "neutral"}>{STATUS_LABEL[status] ?? status}</Badge>}
        {!status && <Badge tone="neutral">Non fourni</Badge>}
      </div>
      {status === "REJECTED" && rejectionReason && (
        <p className="text-xs text-red-600">Motif du refus : {rejectionReason}</p>
      )}
      {state.status === "error" && <Alert tone="error">{state.message}</Alert>}
      {state.status === "success" && <Alert tone="success">Document envoyé.</Alert>}
      <form action={formAction} className="flex items-center gap-2">
        <Input type="file" name="file" required accept="image/*,application/pdf" className="text-sm" />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Envoi..." : status ? "Remplacer" : "Envoyer"}
        </Button>
      </form>
    </div>
  );
}
