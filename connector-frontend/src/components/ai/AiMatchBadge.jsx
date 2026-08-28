import React from 'react';
import { Sparkles } from 'lucide-react';
import { getMatchScoreBadgeColor } from '../../utils/helpers';

export default function AiMatchBadge({ score = 85, showIcon = true, size = 'sm', className = '' }) {
  const badgeColor = getMatchScoreBadgeColor(score);

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm font-bold',
    lg: 'px-4 py-2 text-base font-extrabold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold shadow-xs ${badgeColor} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 animate-pulse text-white/90" />}
      <span>{score}% AI Match</span>
    </span>
  );
}
