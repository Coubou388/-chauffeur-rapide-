"use client";

import { useActionState } from "react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { registerClientAction, type RegisterClientState } from "@/app/inscription/actions";

const initialState: RegisterClientState = { status: "idle" };

export function RegisterClientForm() {
  const [state, formAction, pending] = useActionState(registerClientAction, initialState);

  return (
    <div>
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Nom complet" htmlFor="fullName" required>
          <Input id="fullName" name="fullName" required minLength={2} autoComplete="name" />
        </Field>
        <Field label="Téléphone" htmlFor="phone" required>
          <Input id="phone" name="phone" required placeholder="Ex: 0700000000" autoComplete="tel" />
        </Field>
        <Field label="Mot de passe" htmlFor="password" required hint="6 caractères minimum.">
          <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Création..." : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
