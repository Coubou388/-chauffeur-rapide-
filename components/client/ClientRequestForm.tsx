"use client";

import { useActionState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { COMMUNES } from "@/lib/constants";
import { submitClientRequestAction, type ClientRequestState } from "@/app/demande/actions";

type Category = { id: string; label: string };

const initialState: ClientRequestState = { status: "idle" };

export function ClientRequestForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(submitClientRequestAction, initialState);

  if (state.status === "success") {
    return (
      <Alert tone="success">
        Merci ! Votre demande a été envoyée. Nous vous mettons en relation
        avec un chauffeur disponible dès que possible.
      </Alert>
    );
  }

  return (
    <div>
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Votre nom" htmlFor="fullName" required>
          <Input id="fullName" name="fullName" required minLength={2} />
        </Field>
        <Field label="Votre téléphone" htmlFor="phone" required>
          <Input id="phone" name="phone" required placeholder="Ex: 0700000000" />
        </Field>
        <Field label="Catégorie recherchée (optionnel)" htmlFor="categoryId">
          <Select id="categoryId" name="categoryId" defaultValue="">
            <option value="">Peu importe</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Commune / ville (optionnel)" htmlFor="commune">
          <Select id="commune" name="commune" defaultValue="">
            <option value="">Peu importe</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Durée souhaitée (optionnel)" htmlFor="durationNeeded">
          <Input id="durationNeeded" name="durationNeeded" placeholder="Ex: 1 semaine, ponctuel..." />
        </Field>
        <Field label="Décrivez votre besoin" htmlFor="description" required>
          <Textarea
            id="description"
            name="description"
            required
            minLength={10}
            placeholder="Ex: Je cherche un chauffeur pour un trajet Cocody-Aéroport demain à 8h."
          />
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Envoi..." : "Envoyer ma demande"}
        </Button>
      </form>
    </div>
  );
}
