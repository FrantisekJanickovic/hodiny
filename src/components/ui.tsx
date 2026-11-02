import type { ButtonHTMLAttributes, ReactNode } from "react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export { cx };

type Variant = "primary" | "sun" | "ghost" | "outline" | "leaf";
type Size = "sm" | "md" | "lg" | "xl";

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  const v = {
    primary: "bg-ink text-white hover:bg-ink-soft border-b-4 border-[#0f1640] active:border-b-2 active:translate-y-[2px]",
    sun: "bg-sun text-ink hover:brightness-105 border-b-4 border-sun-deep active:border-b-2 active:translate-y-[2px]",
    leaf: "bg-leaf text-white hover:brightness-105 border-b-4 border-[#157049] active:border-b-2 active:translate-y-[2px]",
    ghost: "bg-transparent text-ink hover:bg-ink/5",
    outline: "bg-card text-ink border-2 border-line hover:border-mist",
  }[variant];
  const sz = {
    sm: "h-9 px-3 text-sm rounded-xl",
    md: "h-11 px-4 text-base rounded-xl",
    lg: "h-14 px-6 text-lg rounded-2xl",
    xl: "h-16 px-6 text-xl rounded-2xl w-full",
  }[size];
  return cx(
    "inline-flex items-center justify-center gap-2 font-bold transition-[transform,background,filter] select-none disabled:opacity-50 disabled:pointer-events-none",
    v,
    sz,
    extra,
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, children, ...rest }: BtnProps) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("rounded-3xl bg-card border border-line", className)}>{children}</div>;
}

/** Výber z pár možností — na obrazovke pred tréningom. */
export function Chips<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "h-12 min-w-14 px-4 rounded-2xl text-lg font-black border-2 transition-colors",
            value === o.value ? "bg-sun border-sun-deep text-ink" : "bg-card border-line text-slate hover:border-mist",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
