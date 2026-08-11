"use client";

import { useActionState } from "react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { loginAction, type LoginState } from "@/app/connexion/actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div>
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Téléphone ou email" htmlFor="identifier" required>
          <Input id="identifier" name="identifier" required placeholder="Ex: 0700000000" autoComplete="username" />
        </Field>
        <Field label="Mot de passe" htmlFor="password" required>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
