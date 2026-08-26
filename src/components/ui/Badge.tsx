import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "amber" | "cyan" | "emerald" | "rose" | "violet" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border-slate-700/60",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    violet: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    outline: "bg-transparent text-slate-400 border-slate-700/70",
  };

  const dotColors = {
    default: "bg-slate-400",
    amber: "bg-amber-400",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
    rose: "bg-rose-400",
    violet: "bg-purple-400",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-medium",
    md: "text-xs px-3 py-1 font-medium",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-md border tracking-tight transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {dot && <span className={clsx("h-1.5 w-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
}
