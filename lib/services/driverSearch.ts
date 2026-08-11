import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { DriverSearchInput } from "@/lib/validations/driver";

const PAGE_SIZE = 12;

// Logique de recherche partagée par la page /recherche/resultats (Server
// Component) et par GET /api/drivers/search (réutilisable par un futur
// client mobile ou le bot WhatsApp).
export async function searchDrivers(filters: DriverSearchInput) {
  const where: Prisma.DriverProfileWhereInput = {
    // On n'affiche jamais les dossiers refusés dans la recherche publique.
    status: { not: "REJECTED" },
  };

  if (filters.category) {
    where.categories = { some: { category: { slug: filters.category } } };
  }
  if (filters.commune) {
    where.commune = { equals: filters.commune, mode: "insensitive" };
  }
  if (filters.availability) {
    where.availability = filters.availability;
  }
  if (filters.minExperience !== undefined) {
    where.yearsExperience = { gte: filters.minExperience };
  }

  const page = filters.page ?? 1;

  const [drivers, total] = await Promise.all([
    prisma.driverProfile.findMany({
      where,
      include: {
        categories: { include: { category: true } },
      },
      orderBy: [{ status: "desc" }, { availability: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.driverProfile.count({ where }),
  ]);

  return {
    drivers,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getDriverProfileById(id: string) {
  return prisma.driverProfile.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      documents: true,
    },
  });
}

export async function recordProfileView(params: {
  driverProfileId: string;
  viewerUserId?: string;
  viewerIp?: string;
}) {
  return prisma.profileView.create({
    data: {
      driverProfileId: params.driverProfileId,
      viewerUserId: params.viewerUserId,
      viewerIp: params.viewerIp,
    },
  });
}
