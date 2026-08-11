import "server-only";
import { prisma } from "@/lib/prisma";

export async function getDriverDashboardData(driverProfileId: string) {
  const [profile, viewsCount, contactsCount, bookingsCount, recentContacts, recentBookings] =
    await Promise.all([
      prisma.driverProfile.findUnique({
        where: { id: driverProfileId },
        include: { categories: { include: { category: true } }, documents: true },
      }),
      prisma.profileView.count({ where: { driverProfileId } }),
      prisma.contactRequest.count({ where: { driverProfileId } }),
      prisma.bookingRequest.count({ where: { driverProfileId } }),
      prisma.contactRequest.findMany({
        where: { driverProfileId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.bookingRequest.findMany({
        where: { driverProfileId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return { profile, viewsCount, contactsCount, bookingsCount, recentContacts, recentBookings };
}
