import { cx } from "@/lib/cx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
