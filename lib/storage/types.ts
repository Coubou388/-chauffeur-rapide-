// Abstraction de stockage de fichiers. Toute la logique métier passe par
// cette interface pour pouvoir changer de provider sans toucher au reste du
// code (lib/services/documents.ts, routes API...).
export interface StorageProvider {
  /** Enregistre un fichier et renvoie un chemin de stockage interne (pas une URL publique). */
  save(params: {
    buffer: Buffer;
    originalName: string;
    folder: string;
  }): Promise<{ storagePath: string }>;
  /** Relit le contenu d'un fichier à partir de son storagePath. */
  read(storagePath: string): Promise<Buffer>;
  /** Supprime un fichier. */
  delete(storagePath: string): Promise<void>;
}

export function sanitizeExtension(originalName: string): string {
  const ext = originalName.slice(originalName.lastIndexOf(".")).toLowerCase();
  // On ne garde que des extensions "safe" attendues pour des documents/photos.
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
  return allowed.includes(ext) ? ext : "";
}
