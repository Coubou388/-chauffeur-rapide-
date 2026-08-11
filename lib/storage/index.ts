import "server-only";
import path from "node:path";
import type { StorageProvider } from "./types";
import { LocalStorageProvider } from "./localProvider";
import { SupabaseStorageProvider } from "./supabaseProvider";

export type { StorageProvider } from "./types";

let instance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (instance) return instance;

  const provider = process.env.STORAGE_PROVIDER || "local";

  if (provider === "supabase") {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "driver-documents";
    if (!url || !serviceRoleKey) {
      throw new Error(
        "STORAGE_PROVIDER=supabase requiert SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env."
      );
    }
    instance = new SupabaseStorageProvider({ url, serviceRoleKey, bucket });
    return instance;
  }

  // Provider local : pratique en développement, mais ne persiste pas sur
  // les plateformes serverless (voir README > Stockage des fichiers).
  const root = process.env.STORAGE_DIR || "./storage/uploads";
  // Le chemin dépend d'une variable d'env, donc Turbopack ne peut pas le
  // résoudre statiquement pour le tracing de build — sans risque ici (le
  // chemin est une config de déploiement, pas une donnée arbitraire).
  instance = new LocalStorageProvider(
    path.resolve(/* turbopackIgnore: true */ process.cwd(), root)
  );
  return instance;
}
