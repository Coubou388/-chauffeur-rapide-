import type { Prisma } from "@/lib/generated/prisma/client";

export type DriverWithCategories = Prisma.DriverProfileGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

export type DriverWithDetails = Prisma.DriverProfileGetPayload<{
  include: {
    categories: { include: { category: true } };
    documents: true;
  };
}>;
