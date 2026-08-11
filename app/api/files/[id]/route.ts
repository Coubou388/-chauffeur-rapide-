import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDocumentForAccessCheck, readDocumentFile } from "@/lib/services/documents";

// Sert les fichiers uploadés (pièce d'identité, permis, photo de profil).
// Seule la photo de profil est publique ; les autres types ne sont
// accessibles qu'au chauffeur propriétaire ou à un administrateur.
export async function GET(
  _req: NextRequest,
  { params }: RouteContext<"/api/files/[id]">
) {
  const { id } = await params;
  const document = await getDocumentForAccessCheck(id);
  if (!document) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  if (document.type !== "PROFILE_PHOTO") {
    const session = await getSession();
    const isOwner = session?.userId === document.driverProfile.userId;
    const isAdmin = session?.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Accès non autorisé." }, { status: 403 });
    }
  }

  const buffer = await readDocumentFile(document.storagePath);
  const contentType = guessContentType(document.storagePath);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": document.type === "PROFILE_PHOTO" ? "public, max-age=3600" : "private, no-store",
    },
  });
}

function guessContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
    default:
      return "image/jpeg";
  }
}
