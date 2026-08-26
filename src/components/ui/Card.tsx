import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "highlight" | "glass";
  glow?: "amber" | "cyan" | "emerald" | "none";
}

export function Card({
  children,
  variant = "default",
  glow = "none",
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-[#11141B] border border-[#1E2530] text-slate-200",
    elevated: "bg-[#151922] border border-[#232B38] text-slate-200 shadow-lg shadow-black/40",
    interactive:
      "bg-[#11141B] border border-[#1E2530] hover:border-[#333E50] hover:bg-[#151922] text-slate-200 transition-all duration-200 cursor-pointer",
    highlight:
      "bg-[#131922] border border-cyan-500/30 text-slate-200 shadow-sm shadow-cyan-950/30",
    glass:
      "bg-[#11141B]/90 backdrop-blur-md border border-[#1E2530] text-slate-200",
  };

  const glowStyles = {
    none: "",
    amber: "ring-1 ring-amber-500/30 shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)]",
    cyan: "ring-1 ring-cyan-500/30 shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)]",
    emerald: "ring-1 ring-emerald-500/30 shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
  };

  return (
    <div
      className={twMerge(
        clsx("rounded-xl p-4 sm:p-5", variantStyles[variant], glowStyles[glow], className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}
