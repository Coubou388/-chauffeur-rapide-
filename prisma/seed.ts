/**
 * Données de démonstration. Exécuté via `npx prisma db seed`
 * (voir prisma.config.ts > migrations.seed).
 *
 * Imports en chemins relatifs (pas d'alias "@/...") : ce script tourne via
 * tsx en dehors du bundler Next.js. On évite volontairement d'importer
 * lib/storage (qui a un `import "server-only"` en tête — ce garde-fou lève
 * une erreur dès qu'il est chargé hors du bundler Next.js) : on écrit donc
 * les fichiers placeholder directement avec node:fs, en respectant la même
 * convention de chemin que LocalStorageProvider.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";
import { DRIVER_CATEGORIES } from "../lib/constants";
import { DocumentStatus, DocumentType, DriverStatus } from "../lib/generated/prisma/enums";

// PNG transparent 1x1, réutilisé comme placeholder pour tous les documents
// de démo (permet de tester GET /api/files/[id] de bout en bout).
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

const STORAGE_ROOT = path.resolve(process.cwd(), process.env.STORAGE_DIR || "./storage/uploads");

async function seedPlaceholderDocument(driverProfileId: string, type: (typeof DocumentType)[keyof typeof DocumentType], status: (typeof DocumentStatus)[keyof typeof DocumentStatus]) {
  const folder = `drivers/${driverProfileId}`;
  await mkdir(path.join(STORAGE_ROOT, folder), { recursive: true });
  const storagePath = path.posix.join(folder, `${randomUUID()}.png`);
  await writeFile(path.join(STORAGE_ROOT, storagePath), PLACEHOLDER_PNG);
  return prisma.documentUpload.create({
    data: { driverProfileId, type, storagePath, status },
  });
}

type DriverSeed = {
  firstName: string;
  lastName: string;
  phone: string;
  commune: string;
  categorySlugs: string[];
  yearsExperience: number;
  availability: "AVAILABLE" | "BUSY" | "OFFLINE";
  workZones: string[];
  status: (typeof DriverStatus)[keyof typeof DriverStatus];
  source?: "WEB" | "WHATSAPP";
  bio?: string;
};

const DEMO_DRIVERS: DriverSeed[] = [
  {
    firstName: "Kouassi",
    lastName: "Yao",
    phone: "+2250700000001",
    commune: "Cocody",
    categorySlugs: ["taxi-compteur", "yango-vtc"],
    yearsExperience: 7,
    availability: "AVAILABLE",
    workZones: ["Cocody", "Plateau", "Marcory"],
    status: DriverStatus.VALIDATED,
    bio: "Chauffeur expérimenté, ponctuel et courtois. Connaît bien Abidjan.",
  },
  {
    firstName: "Aya",
    lastName: "Kouadio",
    phone: "+2250700000002",
    commune: "Yopougon",
    categorySlugs: ["personnel"],
    yearsExperience: 5,
    availability: "AVAILABLE",
    workZones: ["Yopougon", "Attécoubé"],
    status: DriverStatus.VALIDATED,
    bio: "Chauffeur personnel pour familles, discrétion assurée.",
  },
  {
    firstName: "Ibrahim",
    lastName: "Traoré",
    phone: "+2250700000003",
    commune: "Marcory",
    categorySlugs: ["gbaka"],
    yearsExperience: 10,
    availability: "BUSY",
    workZones: ["Marcory", "Koumassi", "Port-Bouët"],
    status: DriverStatus.VALIDATED,
  },
  {
    firstName: "Mariam",
    lastName: "Diabaté",
    phone: "+2250700000004",
    commune: "Plateau",
    categorySlugs: ["entreprise"],
    yearsExperience: 8,
    availability: "AVAILABLE",
    workZones: ["Plateau", "Cocody"],
    status: DriverStatus.VALIDATED,
    bio: "Chauffeur d'entreprise, disponible pour contrats longue durée.",
  },
  {
    firstName: "Bakary",
    lastName: "Sanogo",
    phone: "+2250700000005",
    commune: "Abobo",
    categorySlugs: ["woro-woro"],
    yearsExperience: 4,
    availability: "AVAILABLE",
    workZones: ["Abobo", "Adjamé"],
    status: DriverStatus.PENDING,
  },
  {
    firstName: "Aminata",
    lastName: "Ouattara",
    phone: "+2250700000006",
    commune: "Koumassi",
    categorySlugs: ["livreur"],
    yearsExperience: 2,
    availability: "AVAILABLE",
    workZones: ["Koumassi", "Marcory", "Treichville"],
    status: DriverStatus.PENDING,
    source: "WHATSAPP",
  },
  {
    firstName: "Séraphin",
    lastName: "Kablan",
    phone: "+2250700000007",
    commune: "Treichville",
    categorySlugs: ["poids-lourd"],
    yearsExperience: 15,
    availability: "OFFLINE",
    workZones: ["Treichville", "Port-Bouët"],
    status: DriverStatus.IN_REVIEW,
  },
  {
    firstName: "Affoué",
    lastName: "N'Guessan",
    phone: "+2250700000008",
    commune: "Cocody",
    categorySlugs: ["yango-vtc", "remplacement"],
    yearsExperience: 3,
    availability: "AVAILABLE",
    workZones: ["Cocody", "Bingerville"],
    status: DriverStatus.VALIDATED,
  },
  {
    firstName: "Konan",
    lastName: "Kouamé",
    phone: "+2250700000009",
    commune: "Port-Bouët",
    categorySlugs: ["bus-car"],
    yearsExperience: 12,
    availability: "AVAILABLE",
    workZones: ["Port-Bouët", "Koumassi"],
    status: DriverStatus.VALIDATED,
  },
  {
    firstName: "Fatou",
    lastName: "Konaté",
    phone: "+2250700000010",
    commune: "Adjamé",
    categorySlugs: ["taxi-compteur"],
    yearsExperience: 6,
    availability: "BUSY",
    workZones: ["Adjamé", "Plateau"],
    status: DriverStatus.REJECTED,
    bio: "Dossier refusé : pièce d'identité illisible (voir motif).",
  },
  {
    firstName: "Yao",
    lastName: "Brou",
    phone: "+2250700000011",
    commune: "Bouaké",
    categorySlugs: ["personnel", "entreprise"],
    yearsExperience: 9,
    availability: "AVAILABLE",
    workZones: ["Bouaké"],
    status: DriverStatus.VALIDATED,
  },
  {
    firstName: "Adjoua",
    lastName: "Assi",
    phone: "+2250700000012",
    commune: "San-Pédro",
    categorySlugs: ["remplacement"],
    yearsExperience: 1,
    availability: "AVAILABLE",
    workZones: ["San-Pédro"],
    status: DriverStatus.PENDING,
    source: "WHATSAPP",
  },
  {
    firstName: "Kablan",
    lastName: "Kouassi",
    phone: "+2250700000013",
    commune: "Yamoussoukro",
    categorySlugs: ["gbaka", "bus-car"],
    yearsExperience: 11,
    availability: "AVAILABLE",
    workZones: ["Yamoussoukro"],
    status: DriverStatus.VALIDATED,
  },
];

async function main() {
  console.log("Seed: catégories...");
  const categoryBySlug = new Map<string, string>();
  for (const cat of DRIVER_CATEGORIES) {
    const row = await prisma.driverCategory.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, description: cat.description },
      create: { slug: cat.slug, label: cat.label, description: cat.description },
    });
    categoryBySlug.set(cat.slug, row.id);
  }

  console.log("Seed: compte admin...");
  const adminPasswordHash = await hashPassword("Admin123!");
  await prisma.user.upsert({
    where: { email: "admin@chauffeurrapide.ci" },
    update: {},
    create: {
      role: "ADMIN",
      email: "admin@chauffeurrapide.ci",
      fullName: "Administrateur Chauffeur Rapide",
      passwordHash: adminPasswordHash,
    },
  });

  console.log("Seed: compte client de démo...");
  const clientPasswordHash = await hashPassword("Client123!");
  const client = await prisma.user.upsert({
    where: { phone: "+2250100000000" },
    update: {},
    create: {
      role: "CLIENT",
      phone: "+2250100000000",
      fullName: "Client Démo",
      passwordHash: clientPasswordHash,
    },
  });
  await prisma.creditWallet.upsert({
    where: { userId: client.id },
    update: {},
    create: { userId: client.id, freeContactsRemaining: 3 },
  });

  console.log("Seed: chauffeurs de démo...");
  const driverPasswordHash = await hashPassword("Chauffeur123!");
  const createdDrivers: { id: string; status: string }[] = [];

  for (const d of DEMO_DRIVERS) {
    const categoryIds = d.categorySlugs
      .map((slug) => categoryBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    const user = await prisma.user.upsert({
      where: { phone: d.phone },
      update: {},
      create: {
        role: "DRIVER",
        phone: d.phone,
        fullName: `${d.firstName} ${d.lastName}`,
        passwordHash: driverPasswordHash,
        driverProfile: {
          create: {
            firstName: d.firstName,
            lastName: d.lastName,
            phone: d.phone,
            commune: d.commune,
            yearsExperience: d.yearsExperience,
            availability: d.availability,
            workZones: d.workZones,
            status: d.status,
            source: d.source ?? "WEB",
            bio: d.bio,
            rejectionReason: d.status === DriverStatus.REJECTED ? "Pièce d'identité illisible, merci de la re-soumettre." : undefined,
            validatedAt: d.status === DriverStatus.VALIDATED ? new Date() : undefined,
            categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
          },
        },
      },
      include: { driverProfile: true },
    });

    const driverProfile = user.driverProfile;
    if (!driverProfile) continue; // déjà existant (re-run du seed)
    createdDrivers.push({ id: driverProfile.id, status: driverProfile.status });

    await seedPlaceholderDocument(driverProfile.id, DocumentType.ID_CARD, DocumentStatus.APPROVED);
    await seedPlaceholderDocument(driverProfile.id, DocumentType.DRIVER_LICENSE, DocumentStatus.APPROVED);
    if (Math.random() > 0.4) {
      await seedPlaceholderDocument(driverProfile.id, DocumentType.PROFILE_PHOTO, DocumentStatus.APPROVED);
    }

    // Quelques vues de profil pour peupler les statistiques du dashboard.
    const viewsCount = Math.floor(Math.random() * 40);
    for (let i = 0; i < viewsCount; i++) {
      await prisma.profileView.create({
        data: { driverProfileId: driverProfile.id, viewerIp: "0.0.0.0" },
      });
    }
  }

  console.log("Seed: demandes clients de démo...");
  const validated = createdDrivers.filter((d) => d.status === DriverStatus.VALIDATED);
  const anyCategoryId = [...categoryBySlug.values()][0];

  await prisma.clientRequest.createMany({
    data: [
      {
        fullName: "Awa Koné",
        phone: "+2250500000001",
        categoryId: categoryBySlug.get("taxi-compteur"),
        commune: "Cocody",
        description: "Je cherche un chauffeur pour un trajet Cocody-Aéroport demain matin.",
        durationNeeded: "Ponctuel",
      },
      {
        fullName: "Jean-Marc Assouan",
        phone: "+2250500000002",
        categoryId: categoryBySlug.get("personnel"),
        commune: "Marcory",
        description: "Recherche chauffeur personnel disponible du lundi au vendredi.",
        durationNeeded: "Long terme",
      },
      {
        fullName: "Nadège Bamba",
        phone: "+2250500000003",
        categoryId: anyCategoryId,
        commune: "Yopougon",
        description: "Besoin d'un chauffeur pour un déménagement ce week-end.",
        durationNeeded: "Un week-end",
      },
    ],
  });

  if (validated[0]) {
    await prisma.contactRequest.create({
      data: {
        driverProfileId: validated[0].id,
        clientUserId: client.id,
        clientName: "Client Démo",
        clientPhone: "+2250100000000",
        message: "Bonjour, êtes-vous disponible ce week-end ?",
        unlocked: true,
      },
    });
  }
  if (validated[1]) {
    await prisma.bookingRequest.create({
      data: {
        driverProfileId: validated[1].id,
        clientUserId: client.id,
        clientName: "Client Démo",
        clientPhone: "+2250100000000",
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        durationLabel: "3 jours",
        zone: "Abidjan",
      },
    });
  }

  console.log("Seed terminé ✅");
  console.log("");
  console.log("Comptes de démonstration :");
  console.log("  Admin      : admin@chauffeurrapide.ci / Admin123!");
  console.log("  Chauffeur  : +2250700000001 / Chauffeur123! (profil validé)");
  console.log("  Client     : +2250100000000 / Client123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
