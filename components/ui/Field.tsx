import { cx } from "@/lib/cx";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-stone-800">
        {label}
        {required && <span className="text-primary-600"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border-2 border-stone-300 bg-white px-4 py-3 text-base text-stone-900 outline-none transition-colors focus:border-primary-500";

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cx(inputBase, invalid && "border-red-400", className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={cx(inputBase, "min-h-28 resize-y", invalid && "border-red-400", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      className={cx(inputBase, "bg-white", invalid && "border-red-400", className)}
      {...props}
    />
  );
}
