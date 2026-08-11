import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DRIVER_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      {/* Hero : les deux parcours principaux, gros boutons, zéro ambiguïté. */}
      <section className="bg-gradient-to-b from-primary-50 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Trouvez un chauffeur, <span className="text-primary-600">rapidement</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            La plateforme ivoirienne qui met en relation clients et chauffeurs
            vérifiés : taxi, VTC, wôrô-wôrô, gbaka, chauffeur personnel et
            plus encore.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <LinkButton href="/recherche" size="lg" variant="primary" className="w-full">
              🔎 Je cherche un chauffeur
            </LinkButton>
            <LinkButton href="/chauffeur/inscription" size="lg" variant="secondary" className="w-full">
              🚖 Je suis chauffeur
            </LinkButton>
          </div>

          <div className="mx-auto mt-4 flex max-w-2xl flex-col gap-2 text-sm text-stone-600 sm:flex-row sm:justify-center sm:gap-6">
            <Link href="/recherche" className="underline underline-offset-2 hover:text-primary-700">
              Continuer sans compte
            </Link>
            <Link
              href="/chauffeur/inscription/whatsapp"
              className="underline underline-offset-2 hover:text-primary-700"
            >
              S&apos;inscrire comme chauffeur via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-stone-900">Comment ça marche ?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-3xl">1️⃣</p>
            <h3 className="mt-2 font-bold text-stone-900">Recherchez</h3>
            <p className="mt-1 text-sm text-stone-600">
              Filtrez par catégorie, commune, disponibilité et expérience.
            </p>
          </Card>
          <Card>
            <p className="text-3xl">2️⃣</p>
            <h3 className="mt-2 font-bold text-stone-900">Contactez</h3>
            <p className="mt-1 text-sm text-stone-600">
              Consultez le profil et demandez à être mis en relation, sans
              créer de compte.
            </p>
          </Card>
          <Card>
            <p className="text-3xl">3️⃣</p>
            <h3 className="mt-2 font-bold text-stone-900">Roulez</h3>
            <p className="mt-1 text-sm text-stone-600">
              Convenez des détails directement avec le chauffeur.
            </p>
          </Card>
        </div>
      </section>

      {/* Catégories */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            Toutes les catégories de chauffeurs
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {DRIVER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/recherche/resultats?category=${cat.slug}`}
                className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-4 text-center text-sm font-semibold text-stone-700 transition-colors hover:border-primary-500 hover:text-primary-700"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA demande directe */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center">
        <Card className="bg-secondary-50">
          <h2 className="text-xl font-bold text-stone-900">
            Vous ne trouvez pas ce qu&apos;il vous faut ?
          </h2>
          <p className="mt-2 text-stone-600">
            Publiez votre besoin en 1 minute, nous vous mettons en relation
            avec un chauffeur disponible.
          </p>
          <LinkButton href="/demande" variant="secondary" size="lg" className="mt-5">
            Publier une demande
          </LinkButton>
        </Card>
      </section>
    </div>
  );
}
