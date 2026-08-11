import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Connexion — Chauffeur Rapide" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-center text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Connexion
      </h1>
      <p className="mt-1 text-center text-stone-600">
        Chauffeurs, clients et administrateurs se connectent ici.
      </p>

      <Card className="mt-6">
        <LoginForm />
      </Card>

      <p className="mt-4 text-center text-sm text-stone-500">
        Pas encore de compte client ?{" "}
        <Link href="/inscription" className="font-semibold text-primary-600 underline">
          Créer un compte
        </Link>
      </p>
      <p className="mt-1 text-center text-sm text-stone-500">
        Vous êtes chauffeur ?{" "}
        <Link href="/chauffeur/inscription" className="font-semibold text-primary-600 underline">
          Inscrivez-vous ici
        </Link>
      </p>
    </div>
  );
}
