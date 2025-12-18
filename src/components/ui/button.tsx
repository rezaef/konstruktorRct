import React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 " +
  "active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-slate-950 hover:brightness-110 hover:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] hover:scale-[1.02]",
  secondary:
    "bg-white/10 text-slate-100 border border-white/10 hover:border-emerald-500/30 hover:bg-white/12 hover:scale-[1.02] hover:shadow-lg",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/8 hover:text-emerald-200 hover:scale-[1.02]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
) {
  const { className = "", variant = "primary", size = "md", ...rest } = props;
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest} />;
}
