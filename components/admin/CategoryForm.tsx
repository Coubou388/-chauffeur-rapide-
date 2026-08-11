"use client";

import { useActionState } from "react";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createCategoryAction, type SimpleState } from "@/app/admin/categories/actions";

const initialState: SimpleState = { status: "idle" };

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, initialState);

  return (
    <div>
      {state.status === "error" && (
        <Alert tone="error" className="mb-3">
          {state.message}
        </Alert>
      )}
      {state.status === "success" && (
        <Alert tone="success" className="mb-3">
          Catégorie créée.
        </Alert>
      )}
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Nom de la catégorie" htmlFor="label" required>
          <Input id="label" name="label" required minLength={3} placeholder="Ex: Chauffeur de moto-taxi" />
        </Field>
        <Field label="Description (optionnel)" htmlFor="description">
          <Input id="description" name="description" placeholder="Courte description" />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "..." : "Ajouter"}
        </Button>
      </form>
    </div>
  );
}
