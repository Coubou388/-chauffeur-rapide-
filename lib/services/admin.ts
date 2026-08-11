import "server-only";
import { prisma } from "@/lib/prisma";
import { DriverStatus } from "@/lib/generated/prisma/enums";

export async function logAdminAction(params: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  notes?: string;
}) {
  return prisma.adminAction.create({ data: params });
}

export async function listDriversForAdmin(status?: string) {
  return prisma.driverProfile.findMany({
    where: status ? { status: status as (typeof DriverStatus)[keyof typeof DriverStatus] } : undefined,
    include: {
      categories: { include: { category: true } },
      documents: true,
      user: { select: { email: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDriverForAdmin(id: string) {
  return prisma.driverProfile.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      documents: true,
      user: { select: { email: true, phone: true, createdAt: true } },
    },
  });
}

export async function validateDriver(params: { driverProfileId: string; adminUserId: string }) {
  const driver = await prisma.driverProfile.update({
    where: { id: params.driverProfileId },
    data: {
      status: DriverStatus.VALIDATED,
      validatedAt: new Date(),
      validatedById: params.adminUserId,
      rejectionReason: null,
    },
  });
  await logAdminAction({
    adminUserId: params.adminUserId,
    action: "VALIDATE_DRIVER",
    targetType: "DriverProfile",
    targetId: driver.id,
  });
  return driver;
}

export async function markDriverInReview(params: { driverProfileId: string; adminUserId: string }) {
  const driver = await prisma.driverProfile.update({
    where: { id: params.driverProfileId },
    data: { status: DriverStatus.IN_REVIEW },
  });
  await logAdminAction({
    adminUserId: params.adminUserId,
    action: "MARK_IN_REVIEW",
    targetType: "DriverProfile",
    targetId: driver.id,
  });
  return driver;
}

export async function rejectDriver(params: {
  driverProfileId: string;
  adminUserId: string;
  reason: string;
}) {
  const driver = await prisma.driverProfile.update({
    where: { id: params.driverProfileId },
    data: {
      status: DriverStatus.REJECTED,
      rejectionReason: params.reason,
    },
  });
  await logAdminAction({
    adminUserId: params.adminUserId,
    action: "REJECT_DRIVER",
    targetType: "DriverProfile",
    targetId: driver.id,
    notes: params.reason,
  });
  return driver;
}

export async function getAdminStats() {
  const [
    totalDrivers,
    pendingDrivers,
    validatedDrivers,
    rejectedDrivers,
    totalClientRequests,
    totalContactRequests,
    totalBookingRequests,
    totalViews,
  ] = await Promise.all([
    prisma.driverProfile.count(),
    prisma.driverProfile.count({ where: { status: DriverStatus.PENDING } }),
    prisma.driverProfile.count({ where: { status: DriverStatus.VALIDATED } }),
    prisma.driverProfile.count({ where: { status: DriverStatus.REJECTED } }),
    prisma.clientRequest.count(),
    prisma.contactRequest.count(),
    prisma.bookingRequest.count(),
    prisma.profileView.count(),
  ]);

  return {
    totalDrivers,
    pendingDrivers,
    validatedDrivers,
    rejectedDrivers,
    totalClientRequests,
    totalContactRequests,
    totalBookingRequests,
    totalViews,
  };
}

export async function listBookingRequestsForAdmin() {
  return prisma.bookingRequest.findMany({
    include: { driverProfile: { select: { firstName: true, lastName: true, id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function listContactRequestsForAdmin() {
  return prisma.contactRequest.findMany({
    include: { driverProfile: { select: { firstName: true, lastName: true, id: true } } },
    orderBy: { createdAt: "desc" },
  });
}
