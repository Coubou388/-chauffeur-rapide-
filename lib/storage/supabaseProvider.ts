import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StorageProvider } from "./types";
import { sanitizeExtension } from "./types";

// Provider de production : stocke les fichiers dans un bucket Supabase
// Storage (compatible object storage, persiste sur les plateformes
// serverless contrairement au disque local). Le bucket est privé : seul le
// serveur (via la clé service_role, jamais exposée au client) peut y lire ou
// écrire. Le contrôle d'accès applicatif (propriétaire du document ou admin)
// reste géré par app/api/files/[id]/route.ts, inchangé.
export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucket: string;

  constructor(params: { url: string; serviceRoleKey: string; bucket: string }) {
    this.client = createClient(params.url, params.serviceRoleKey, {
      auth: { persistSession: false },
    });
    this.bucket = params.bucket;
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
    const filename = `${randomUUID()}${sanitizeExtension(originalName)}`;
    const storagePath = `${folder}/${filename}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(storagePath, buffer, {
        contentType: guessContentType(filename),
        upsert: false,
      });
    if (error) {
      throw new Error(`Échec de l'upload vers Supabase Storage : ${error.message}`);
    }
    return { storagePath };
  }

  async read(storagePath: string): Promise<Buffer> {
    const { data, error } = await this.client.storage.from(this.bucket).download(storagePath);
    if (error || !data) {
      throw new Error(`Échec de la lecture depuis Supabase Storage : ${error?.message}`);
    }
    return Buffer.from(await data.arrayBuffer());
  }

  async delete(storagePath: string): Promise<void> {
    await this.client.storage.from(this.bucket).remove([storagePath]);
  }
}

function guessContentType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    default:
      return "image/jpeg";
  }
}
