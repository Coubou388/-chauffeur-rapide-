import { cx } from "@/lib/cx";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const tones: Record<Tone, string> = {
  success: "bg-secondary-50 text-secondary-700 ring-1 ring-secondary-600/20",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  neutral: "bg-stone-100 text-stone-700 ring-1 ring-stone-400/20",
  info: "bg-primary-50 text-primary-700 ring-1 ring-primary-600/20",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
