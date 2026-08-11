import { Badge } from "@/components/ui/Badge";
import { AVAILABILITY_LABELS, DRIVER_STATUS_LABELS } from "@/lib/constants";

export function DriverStatusBadge({ status }: { status: string }) {
  if (status === "VALIDATED") {
    return <Badge tone="success">✓ Vérifié</Badge>;
  }
  if (status === "REJECTED") {
    return <Badge tone="danger">{DRIVER_STATUS_LABELS[status]}</Badge>;
  }
  return <Badge tone="warning">{DRIVER_STATUS_LABELS[status] ?? status}</Badge>;
}

export function AvailabilityBadge({ availability }: { availability: string }) {
  const tone = availability === "AVAILABLE" ? "success" : availability === "BUSY" ? "warning" : "neutral";
  return <Badge tone={tone}>{AVAILABILITY_LABELS[availability] ?? availability}</Badge>;
}
