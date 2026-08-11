"use client";

import { useActionState } from "react";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { contactDriverAction, type ContactFormState } from "@/app/chauffeurs/[id]/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ driverId }: { driverId: string }) {
  const [state, formAction, pending] = useActionState(
    contactDriverAction.bind(null, driverId),
    initialState
  );

  return (
    <div>
      {state.status === "success" && (
        <Alert tone="success" className="mb-4">
          Demande envoyée !{" "}
          {state.phone ? (
            <>
              Numéro du chauffeur : <span className="font-bold">{state.phone}</span>
            </>
          ) : (
            "Le chauffeur va recevoir vos coordonnées."
          )}
        </Alert>
      )}
      {state.status === "locked" && (
        <Alert tone="info" className="mb-4">
          {state.message}
        </Alert>
      )}
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Votre nom" htmlFor="clientName" required>
          <Input id="clientName" name="clientName" required placeholder="Ex: Awa Koné" />
        </Field>
        <Field label="Votre téléphone" htmlFor="clientPhone" required>
          <Input id="clientPhone" name="clientPhone" required placeholder="Ex: 0700000000" />
        </Field>
        <Field label="Message (optionnel)" htmlFor="message">
          <Textarea id="message" name="message" placeholder="Précisez votre besoin..." />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Envoi..." : "Envoyer la demande de contact"}
        </Button>
      </form>
    </div>
  );
}
