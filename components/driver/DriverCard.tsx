import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AvailabilityBadge, DriverStatusBadge } from "@/components/driver/StatusBadge";
import type { DriverWithCategories } from "@/lib/types";

export function DriverCard({ driver }: { driver: DriverWithCategories }) {
  return (
    <Link href={`/chauffeurs/${driver.id}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {driver.firstName} {driver.lastName.charAt(0)}.
            </h3>
            <p className="text-sm text-stone-500">
              {driver.commune} · {driver.yearsExperience} an(s) d&apos;expérience
            </p>
          </div>
          <DriverStatusBadge status={driver.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {driver.categories.map((c) => (
            <span
              key={c.categoryId}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
            >
              {c.category.label}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <AvailabilityBadge availability={driver.availability} />
          <span className="text-sm font-semibold text-primary-600">Voir le profil →</span>
        </div>
      </Card>
    </Link>
  );
}
