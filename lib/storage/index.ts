import "server-only";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Abstraction de stockage de fichiers. Le MVP écrit sur disque local
// (hors de /public — voir plus bas pourquoi), mais toute la logique métier
// passe par cette interface pour pouvoir brancher un provider S3 / object
// storage compatible plus tard sans toucher au reste du code.
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

function sanitizeExtension(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  // On ne garde que des extensions "safe" attendues pour des documents/photos.
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
  return allowed.includes(ext) ? ext : "";
}

class LocalStorageProvider implements StorageProvider {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  async save({
    buffer,
    originalName,
    folder,
  }: {
    buffer: Buffer;
    originalName: string;
    folder: string;
  }) {
    const dir = path.join(this.root, folder);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${sanitizeExtension(originalName)}`;
    const storagePath = path.posix.join(folder, filename);
    await writeFile(path.join(this.root, storagePath), buffer);
    return { storagePath };
  }

  async read(storagePath: string): Promise<Buffer> {
    return readFile(path.join(this.root, storagePath));
  }

  async delete(storagePath: string): Promise<void> {
    await unlink(path.join(this.root, storagePath)).catch(() => undefined);
  }
}

// TODO(production): implémenter S3StorageProvider (ou équivalent compatible
// S3 — Scaleway, OVH, Backblaze B2...) qui implémente la même interface
// StorageProvider avec le SDK @aws-sdk/client-s3. Le reste du code
// (lib/services/documents.ts, routes API) n'aurait rien à changer.
// class S3StorageProvider implements StorageProvider { ... }

let instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!instance) {
    const root = process.env.STORAGE_DIR || "./storage/uploads";
    // Le chemin dépend d'une variable d'env, donc Turbopack ne peut pas le
    // résoudre statiquement pour le tracing de build — sans risque ici (le
    // chemin est une config de déploiement, pas une donnée arbitraire).
    instance = new LocalStorageProvider(
      path.resolve(/* turbopackIgnore: true */ process.cwd(), root)
    );
  }
  return instance;
}
