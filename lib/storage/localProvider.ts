import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { StorageProvider } from "./types";
import { sanitizeExtension } from "./types";

// Stockage sur disque local. Pratique en développement, mais NE PERSISTE
// PAS sur les plateformes serverless (Vercel...) — voir supabaseProvider.ts
// pour le provider utilisé en production.
export class LocalStorageProvider implements StorageProvider {
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
