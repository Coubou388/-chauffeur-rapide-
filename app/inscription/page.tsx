import Link from "next/link";
import { RegisterClientForm } from "@/components/auth/RegisterClientForm";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Créer un compte client — Chauffeur Rapide" };

export default function RegisterClientPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-center text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Créer un compte client
      </h1>
      <p className="mt-1 text-center text-stone-600">
        Facultatif, mais pratique pour suivre vos demandes.
      </p>

      <Card className="mt-6">
        <RegisterClientForm />
      </Card>

      <p className="mt-4 text-center text-sm text-stone-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-primary-600 underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
