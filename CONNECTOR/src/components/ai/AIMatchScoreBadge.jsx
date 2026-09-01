import React from 'react';
import { Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const AIMatchScoreBadge = ({
  score,
  size = 'md',
  showSparkle = true,
  onClick,
  className = ''
}) => {
  if (!score) return null;
  const getTheme = (val) => {
    if (val >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        sparkle: 'text-emerald-500'
      };
    }
    if (val >= 80) {
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        sparkle: 'text-purple-500'
      };
    }
    if (val >= 70) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        sparkle: 'text-blue-500'
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      sparkle: 'text-amber-500'
    };
  };

  const theme = getTheme(score);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full border font-semibold tracking-tight transition-all duration-150',
        onClick && 'cursor-pointer hover:scale-105 active:scale-95 shadow-sm',
        theme.bg,
        sizeClasses[size],
        className
      )}
      title="AI-Computed Compatibility Score"
    >
      {showSparkle && <Sparkles className={`w-3.5 h-3.5 shrink-0 ${theme.sparkle} animate-pulse-subtle`} />}
      <span>{score}% AI Match</span>
    </Component>
  );
};
