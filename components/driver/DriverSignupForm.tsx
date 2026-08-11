"use client";

import { useActionState, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { COMMUNES } from "@/lib/constants";
import { registerDriverAction, type DriverSignupState } from "@/app/chauffeur/inscription/actions";

type Category = { id: string; label: string };

const STEP_LABELS = ["Identité", "Activité", "Documents", "Récapitulatif"] as const;

const initialState: DriverSignupState = { status: "idle" };

export function DriverSignupForm({ categories }: { categories: Category[] }) {
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState(registerDriverAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const step0Ref = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const stepRefs = [step0Ref, step1Ref, step2Ref, step3Ref] as const;

  function validateCurrentStep(): boolean {
    const container = stepRefs[step].current;
    if (!container) return true;
    const fields = container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    for (const field of Array.from(fields)) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    // Vérification spécifique : au moins une catégorie cochée.
    if (step === 1) {
      const checked = container.querySelectorAll<HTMLInputElement>(
        'input[name="categoryIds"]:checked'
      );
      if (checked.length === 0) {
        alert("Choisissez au moins une catégorie de chauffeur.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Fil d'Ariane simple */}
      <ol className="mb-6 flex items-center gap-2 text-sm">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cx(
                "flex h-7 w-7 items-center justify-center rounded-full font-bold",
                i === step
                  ? "bg-primary-600 text-white"
                  : i < step
                    ? "bg-secondary-600 text-white"
                    : "bg-stone-200 text-stone-500"
              )}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={cx("hidden sm:inline", i === step ? "font-semibold text-stone-900" : "text-stone-400")}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && <span className="h-px w-4 bg-stone-300" />}
          </li>
        ))}
      </ol>

      {state.status === "error" && (
        <Alert tone="error" className="mb-4">
          {state.message}
        </Alert>
      )}

      <form ref={formRef} action={formAction} className="flex flex-col gap-6">
        {/* Étape 1 : Identité */}
        <div ref={step0Ref} className={cx("flex flex-col gap-4", step !== 0 && "hidden")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" htmlFor="firstName" required>
              <Input id="firstName" name="firstName" required minLength={2} autoComplete="given-name" />
            </Field>
            <Field label="Nom" htmlFor="lastName" required>
              <Input id="lastName" name="lastName" required minLength={2} autoComplete="family-name" />
            </Field>
          </div>
          <Field label="Téléphone" htmlFor="phone" required hint="Ce numéro servira aussi pour vous connecter.">
            <Input id="phone" name="phone" required placeholder="Ex: 0700000000" autoComplete="tel" />
          </Field>
          <Field label="Numéro WhatsApp (si différent)" htmlFor="whatsappPhone">
            <Input id="whatsappPhone" name="whatsappPhone" placeholder="Ex: 0700000000" />
          </Field>
          <Field label="Mot de passe" htmlFor="password" required hint="6 caractères minimum.">
            <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
          </Field>
          <Button type="button" size="lg" onClick={goNext}>
            Suivant
          </Button>
        </div>

        {/* Étape 2 : Activité */}
        <div ref={step1Ref} className={cx("flex flex-col gap-4", step !== 1 && "hidden")}>
          <Field label="Commune / ville" htmlFor="commune" required>
            <Select id="commune" name="commune" required defaultValue="">
              <option value="" disabled>
                Choisissez...
              </option>
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
                  <input type="checkbox" name="categoryIds" value={cat.id} className="h-4 w-4 accent-red-600" />
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
              defaultValue={0}
            />
          </Field>

          <Field label="Disponibilité" htmlFor="availability" required>
            <Select id="availability" name="availability" required defaultValue="AVAILABLE">
              <option value="AVAILABLE">Disponible</option>
              <option value="BUSY">Occupé</option>
              <option value="OFFLINE">Indisponible</option>
            </Select>
          </Field>

          <Field
            label="Zones de travail"
            htmlFor="workZones"
            required
            hint="Séparez les zones par des virgules. Ex: Cocody, Plateau, Marcory"
          >
            <Input id="workZones" name="workZones" required placeholder="Cocody, Plateau" />
          </Field>

          <Field label="Présentation courte (optionnel)" htmlFor="bio">
            <Textarea id="bio" name="bio" maxLength={500} placeholder="Quelques mots sur votre expérience..." />
          </Field>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Précédent
            </Button>
            <Button type="button" className="flex-1" onClick={goNext}>
              Suivant
            </Button>
          </div>
        </div>

        {/* Étape 3 : Documents */}
        <div ref={step2Ref} className={cx("flex flex-col gap-4", step !== 2 && "hidden")}>
          <Field label="Pièce d'identité (CNI, passeport...)" htmlFor="idCard" required hint="Formats acceptés : jpg, png, pdf.">
            <Input id="idCard" name="idCard" type="file" required accept="image/*,application/pdf" />
          </Field>
          <Field label="Permis de conduire" htmlFor="license" required hint="Formats acceptés : jpg, png, pdf.">
            <Input id="license" name="license" type="file" required accept="image/*,application/pdf" />
          </Field>
          <Field label="Photo de profil (optionnel)" htmlFor="photo">
            <Input id="photo" name="photo" type="file" accept="image/*" />
          </Field>
          <Alert tone="info">
            Vos documents sont stockés de façon sécurisée et ne sont visibles
            que par notre équipe de vérification.
          </Alert>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Précédent
            </Button>
            <Button type="button" className="flex-1" onClick={goNext}>
              Suivant
            </Button>
          </div>
        </div>

        {/* Étape 4 : Récapitulatif */}
        <div ref={step3Ref} className={cx("flex flex-col gap-4", step !== 3 && "hidden")}>
          <Alert tone="info">
            Vérifiez vos informations dans les étapes précédentes, puis
            envoyez votre dossier. Il sera examiné par notre équipe sous peu
            (statut « en attente »).
          </Alert>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Précédent
            </Button>
            <Button type="submit" variant="secondary" className="flex-1" disabled={pending}>
              {pending ? "Envoi en cours..." : "Envoyer mon dossier"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
