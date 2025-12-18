import React from "react";

export function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "rounded-3xl border border-white/10 bg-[#111827] shadow-sm " +
        "transition duration-300 ease-out " +
        "hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg " +
        className
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
