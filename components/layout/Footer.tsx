import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Chauffeur Rapide — Côte d&apos;Ivoire.</p>
        <div className="flex gap-4">
          <Link href="/mentions-legales" className="hover:text-primary-600">
            Mentions légales &amp; confidentialité
          </Link>
          <Link href="/admin" className="hover:text-primary-600">
            Espace administrateur
          </Link>
        </div>
      </div>
    </footer>
  );
}
