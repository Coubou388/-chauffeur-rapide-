import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { LinkButton } from "@/components/ui/Button";
import logoIcon from "@/public/logo-icon.png";

const NAV_LINKS = [
  { href: "/recherche", label: "Trouver un chauffeur" },
  { href: "/chauffeur/inscription", label: "Devenir chauffeur" },
  { href: "/demande", label: "Publier une demande" },
] as const;

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src={logoIcon}
            alt="Chauffeur Rapide"
            width={40}
            height={40}
            priority
            className="h-9 w-9 flex-none sm:h-10 sm:w-10"
          />
          <span className="truncate text-lg font-extrabold whitespace-nowrap">
            <span className="text-primary-600">Chauffeur</span>{" "}
            <span className="text-secondary-600">Rapide</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-stone-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-1.5">
          <LinkButton href={accountLink.href} size="sm" variant="outline">
            {accountLink.label}
          </LinkButton>

          {/* Menu mobile : liens de navigation repliés, sans JS requis. */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border-2 border-stone-300 text-stone-700"
            >
              <span aria-hidden className="text-lg leading-none">☰</span>
            </summary>
            <nav className="absolute right-0 top-11 flex w-56 flex-col gap-1 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-primary-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
