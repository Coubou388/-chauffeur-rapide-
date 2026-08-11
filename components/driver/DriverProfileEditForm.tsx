"use client";

import { useActionState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { COMMUNES } from "@/lib/constants";
import { updateDriverProfileAction, type SimpleState } from "@/app/chauffeur/dashboard/actions";

type Category = { id: string; label: string };

const initialState: SimpleState = { status: "idle" };

export function DriverProfileEditForm({
  categories,
  profile,
}: {
  categories: Category[];
  profile: {
    commune: string;
    yearsExperience: number;
    workZones: string[];
    bio: string | null;
    categoryIds: string[];
  };
}) {
  const [state, formAction, pending] = useActionState(updateDriverProfileAction, initialState);

  return (
    <div>
      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}
      {state.status === "success" && (
        <Alert tone="success" className="mb-4">
          Profil mis à jour.
        </Alert>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Commune / ville" htmlFor="commune" required>
          <Select id="commune" name="commune" required defaultValue={profile.commune}>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-stone-800">
            Catégorie(s) de chauffeur <span className="text-primary-600">*</span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 rounded-xl border-2 border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-700 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
              >
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={cat.id}
                  defaultChecked={profile.categoryIds.includes(cat.id)}
                  className="h-4 w-4 accent-orange-600"
                />
                {cat.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Années d'expérience" htmlFor="yearsExperience" required>
          <Input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min={0}
            max={60}
            required
            defaultValue={profile.yearsExperience}
          />
        </Field>

        <Field label="Zones de travail" htmlFor="workZones" required hint="Séparez par des virgules.">
          <Input id="workZones" name="workZones" required defaultValue={profile.workZones.join(", ")} />
        </Field>

        <Field label="Présentation courte (optionnel)" htmlFor="bio">
          <Textarea id="bio" name="bio" maxLength={500} defaultValue={profile.bio ?? ""} />
        </Field>

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}
