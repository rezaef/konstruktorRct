import React from "react";

const base =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 " +
  "placeholder:text-slate-500 outline-none transition duration-200 " +
  "hover:border-white/15 " +
  "focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/30";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${base} ${className}`} {...rest} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${base} min-h-[140px] ${className}`} {...rest} />;
}
