import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm venue-card-touch",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-4", className)} {...props} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50 active:scale-[0.97]",
        // Bigger touch targets on mobile
        size === "sm" ? "min-h-[36px] px-3 py-1.5 text-sm" : "min-h-[44px] px-4 py-2.5 text-sm",
        variant === "default" && "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-900/30",
        variant === "outline" &&
          "border border-[var(--border-strong)] bg-[var(--bg-subtle)] text-slate-100 hover:bg-[var(--border)]",
        variant === "ghost" && "text-slate-100 hover:bg-[var(--bg-surface)]",
        className,
      )}
      {...props}
    />
  );
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "green" | "yellow" | "blue" | "red" | "zinc";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone === "default" && "bg-[var(--border)] text-slate-200",
        tone === "green" && "bg-green-500/15 text-green-300 ring-1 ring-inset ring-green-500/30",
        tone === "yellow" && "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
        tone === "blue" && "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30",
        tone === "red" && "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30",
        tone === "zinc" && "bg-[var(--bg-subtle)] text-slate-300 ring-1 ring-inset ring-[var(--border)]",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[44px] w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-3 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-[44px] w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-subtle)] px-3 text-base sm:text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600",
        className,
      )}
      {...props}
    />
  );
}

type CheckProps = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ label, checked, onChange }: CheckProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-150 active:scale-[0.97]",
        checked
          ? "border-red-500/50 bg-red-500/10 text-red-200"
          : "border-[var(--border)] bg-[var(--bg-subtle)] text-slate-200 hover:bg-[var(--border)]",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-red-600"
      />
      <span>{label}</span>
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </h3>
  );
}
