"use client";

import { useActionState } from "react";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { bookDriverAction, type BookingFormState } from "@/app/chauffeurs/[id]/actions";

const initialState: BookingFormState = { status: "idle" };

export function BookingForm({ driverId }: { driverId: string }) {
  const [state, formAction, pending] = useActionState(
    bookDriverAction.bind(null, driverId),
    initialState
  );

  return (
    <div>
      {state.status === "success" && (
        <Alert tone="success" className="mb-4">
          Réservation envoyée ! Le chauffeur vous contactera pour confirmer.
        </Alert>
      )}
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Votre nom" htmlFor="bClientName" required>
          <Input id="bClientName" name="clientName" required />
        </Field>
        <Field label="Votre téléphone" htmlFor="bClientPhone" required>
          <Input id="bClientPhone" name="clientPhone" required placeholder="Ex: 0700000000" />
        </Field>
        <Field label="Date de début" htmlFor="startDate" required>
          <Input id="startDate" name="startDate" type="date" required />
        </Field>
        <Field label="Date de fin (optionnel)" htmlFor="endDate">
          <Input id="endDate" name="endDate" type="date" />
        </Field>
        <Field label="Durée souhaitée" htmlFor="durationLabel">
          <Input id="durationLabel" name="durationLabel" placeholder="Ex: 3 jours, 1 mois..." />
        </Field>
        <Field label="Zone" htmlFor="zone">
          <Input id="zone" name="zone" placeholder="Ex: Cocody" />
        </Field>
        <Field label="Message (optionnel)" htmlFor="bMessage">
          <Textarea id="bMessage" name="message" />
        </Field>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Envoi..." : "Envoyer la demande de réservation"}
        </Button>
      </form>
    </div>
  );
}
