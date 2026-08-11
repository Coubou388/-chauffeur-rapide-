import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { LinkButton } from "@/components/ui/Button";

export async function Header() {
  const session = await getSession();

  let accountLink: { href: string; label: string } = { href: "/connexion", label: "Connexion" };
  if (session?.role === "DRIVER") {
    accountLink = { href: "/chauffeur/dashboard", label: "Mon tableau de bord" };
  } else if (session?.role === "ADMIN") {
    accountLink = { href: "/admin", label: "Administration" };
  } else if (session?.role === "CLIENT") {
    accountLink = { href: "/mes-demandes", label: "Mes demandes" };
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-stone-900">
          <span aria-hidden className="text-2xl">🚖</span>
          <span>
            Chauffeur <span className="text-primary-600">Rapide</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-stone-700 md:flex">
          <Link href="/recherche" className="hover:text-primary-600">
            Trouver un chauffeur
          </Link>
          <Link href="/chauffeur/inscription" className="hover:text-primary-600">
            Devenir chauffeur
          </Link>
          <Link href="/demande" className="hover:text-primary-600">
            Publier une demande
          </Link>
        </nav>

        <LinkButton href={accountLink.href} size="sm" variant="outline">
          {accountLink.label}
        </LinkButton>
      </div>
    </header>
  );
}
