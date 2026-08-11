import { cx } from "@/lib/cx";

type Tone = "success" | "error" | "info";

const tones: Record<Tone, string> = {
  success: "bg-secondary-50 text-secondary-700 border-secondary-600/30",
  error: "bg-red-50 text-red-700 border-red-600/30",
  info: "bg-primary-50 text-primary-700 border-primary-600/30",
};

export function Alert({
  tone = "info",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      role="status"
      className={cx("rounded-xl border px-4 py-3 text-sm font-medium", tones[tone], className)}
      {...props}
    />
  );
}
