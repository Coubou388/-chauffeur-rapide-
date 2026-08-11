import "server-only";
import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "@/lib/storage";
import { DocumentStatus, DocumentType } from "@/lib/generated/prisma/enums";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 Mo
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export class InvalidFileError extends Error {}

export async function saveDriverDocument(
  driverProfileId: string,
  type: (typeof DocumentType)[keyof typeof DocumentType],
  file: File
) {
  if (file.size === 0) throw new InvalidFileError("Fichier vide.");
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new InvalidFileError("Fichier trop volumineux (8 Mo max).");
  }
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new InvalidFileError("Format de fichier non accepté (jpg, png, webp, pdf).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorageProvider();
  const { storagePath } = await storage.save({
    buffer,
    originalName: file.name,
    folder: `drivers/${driverProfileId}`,
  });

  // Un seul document actif par type : on remplace l'éventuel précédent
  // (utile en cas de refus + re-soumission).
  const previous = await prisma.documentUpload.findFirst({
    where: { driverProfileId, type },
  });
  if (previous) {
    await storage.delete(previous.storagePath);
    await prisma.documentUpload.delete({ where: { id: previous.id } });
  }

  const document = await prisma.documentUpload.create({
    data: { driverProfileId, type, storagePath, status: DocumentStatus.PENDING },
  });

  // La photo de profil n'a pas besoin de validation admin pour être
  // affichée publiquement (contrairement pièce d'identité / permis).
  if (type === DocumentType.PROFILE_PHOTO) {
    await prisma.documentUpload.update({
      where: { id: document.id },
      data: { status: DocumentStatus.APPROVED },
    });
    await prisma.driverProfile.update({
      where: { id: driverProfileId },
      data: { profilePhotoDocumentId: document.id },
    });
  }

  return document;
}

export async function reviewDocument(params: {
  documentId: string;
  status: (typeof DocumentStatus)[keyof typeof DocumentStatus];
  adminUserId: string;
  rejectionReason?: string;
}) {
  return prisma.documentUpload.update({
    where: { id: params.documentId },
    data: {
      status: params.status,
      reviewedById: params.adminUserId,
      reviewedAt: new Date(),
      rejectionReason: params.rejectionReason,
    },
  });
}

export async function getDocumentForAccessCheck(documentId: string) {
  return prisma.documentUpload.findUnique({
    where: { id: documentId },
    include: { driverProfile: { select: { userId: true } } },
  });
}

export async function readDocumentFile(storagePath: string) {
  return getStorageProvider().read(storagePath);
}
