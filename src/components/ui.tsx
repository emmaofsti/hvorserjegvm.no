import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

/* ─── Card ─────────────────────────────────────────────────────────
   Premium matte surface with concentric corner radii. NOT glass —
   glass is reserved for chrome and active states (Apple HIG rule).
   ──────────────────────────────────────────────────────────────── */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("lg-surface", className)}
      style={{ borderRadius: "var(--lg-r-xl)", ...(props.style ?? {}) }}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

/* ─── Button ───────────────────────────────────────────────────────
   Capsule. Primary uses gradient red; outline uses matte surface.
   ──────────────────────────────────────────────────────────────── */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "lg-capsule lg-energize inline-flex items-center justify-center gap-2 font-medium select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-0",
        "disabled:opacity-50",
        size === "sm" ? "min-h-[36px] px-4 text-[13px]" : "min-h-[44px] px-5 text-sm",
        variant === "default" && [
          "text-white",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.25),0_8px_24px_-8px_rgba(220,38,38,0.55)]",
          "bg-gradient-to-b from-red-500 to-red-700",
          "border border-red-400/40",
          "hover:from-red-500 hover:to-red-600",
        ],
        variant === "outline" && [
          "bg-white/[0.04] text-slate-100 border border-white/[0.10]",
          "hover:bg-white/[0.08] hover:border-white/[0.18]",
        ],
        variant === "ghost" && [
          "text-slate-100 hover:bg-white/[0.06]",
        ],
        className,
      )}
      {...props}
    />
  );
}

/* ─── Badge ───────────────────────────────────────────────────────
   Restrained chip. Default tone is the most-used; semantic tones
   for status (gratis, billett, billigst etc.).
   ──────────────────────────────────────────────────────────────── */
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "green" | "yellow" | "blue" | "red" | "zinc" | "gold";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "lg-capsule inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap",
        tone === "default" && "bg-white/[0.06] text-slate-200 ring-1 ring-inset ring-white/[0.08]",
        tone === "green"   && "bg-emerald-500/12 text-emerald-200 ring-1 ring-inset ring-emerald-400/25",
        tone === "yellow"  && "bg-amber-500/14 text-amber-200 ring-1 ring-inset ring-amber-400/30",
        tone === "blue"    && "bg-sky-500/14 text-sky-200 ring-1 ring-inset ring-sky-400/25",
        tone === "red"     && "bg-red-500/16 text-red-200 ring-1 ring-inset ring-red-400/30",
        tone === "zinc"    && "bg-white/[0.04] text-slate-300 ring-1 ring-inset ring-white/[0.06]",
        tone === "gold"    && "bg-amber-400/18 text-amber-100 ring-1 ring-inset ring-amber-300/40 shadow-[0_0_12px_-4px_rgba(251,191,36,0.4)]",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Input / Select ──────────────────────────────────────────────
   Matte field, no blur. Focus ring is the active signal.
   ──────────────────────────────────────────────────────────────── */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[44px] w-full px-4 text-[15px] sm:text-sm text-slate-100 placeholder:text-slate-500",
        "bg-white/[0.03] border border-white/[0.08]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:border-red-400/30",
        "transition-[box-shadow,border-color] duration-200",
        className,
      )}
      style={{ borderRadius: "var(--lg-r-l)" }}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-[44px] w-full px-4 pr-9 text-[15px] sm:text-sm text-slate-100 appearance-none",
        "bg-white/[0.03] border border-white/[0.08]",
        "bg-[image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22><path fill=%22%2394a3b8%22 d=%22M5 6L0 0h10z%22/></svg>')]",
        "bg-no-repeat bg-[length:10px_6px] [background-position:right_14px_center]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:border-red-400/30",
        "transition-[box-shadow,border-color] duration-200",
        className,
      )}
      style={{ borderRadius: "var(--lg-r-l)" }}
      {...props}
    />
  );
}

/* ─── Toggle ──────────────────────────────────────────────────────
   Capsule filter pill. Inactive = matte. Active = the *only* place
   we use full liquid glass — to signal selection clearly.
   ──────────────────────────────────────────────────────────────── */
type CheckProps = {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ label, checked, onChange }: CheckProps) {
  return (
    <label
      className={cn(
        "lg-capsule lg-energize inline-flex cursor-pointer select-none items-center gap-2 px-3.5 py-2 text-[13px] font-medium",
        checked
          ? "lg-glass-accent"
          : "bg-white/[0.03] border border-white/[0.08] text-slate-200 hover:bg-white/[0.07] hover:border-white/[0.14]",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-red-600"
      />
      <span className="inline-flex items-center gap-1.5">{label}</span>
    </label>
  );
}

/* ─── SectionTitle (eyebrow) ─────────────────────────────────── */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="eyebrow mb-2.5">{children}</h3>;
}

/* ─── Stat — a small label + tnum value pair ────────────────── */
export function Stat({
  label,
  value,
  sub,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="num-display text-base text-slate-100 sm:text-lg">{value}</div>
      {sub && <div className="mt-0.5 text-[11.5px] text-slate-400">{sub}</div>}
    </div>
  );
}
