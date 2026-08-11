import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/jwt";

// Convention "proxy" (remplace middleware.ts depuis Next.js 16). Sert
// uniquement à rediriger tôt les visiteurs non autorisés, pour une
// meilleure UX — ce n'est PAS la source de vérité pour l'autorisation
// (Next.js déconseille désormais l'auth dans ce fichier). La vérification
// faisant foi est faite dans chaque page/action via lib/auth/guards.ts.
const PROTECTED_PREFIXES: Array<{ prefix: string; role: "DRIVER" | "ADMIN" }> = [
  { prefix: "/chauffeur/dashboard", role: "DRIVER" },
  { prefix: "/admin", role: "ADMIN" },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = PROTECTED_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/connexion", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (session.role !== rule.role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chauffeur/dashboard/:path*", "/admin/:path*"],
};
