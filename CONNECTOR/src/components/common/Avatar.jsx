import React, { useState } from 'react';

const GRADIENT_PALETTES = [
  'from-brand-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-red-600',
  'from-blue-600 to-cyan-600',
  'from-violet-600 to-purple-800'
];

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px] rounded-lg',
  sm: 'w-8 h-8 text-xs rounded-xl',
  md: 'w-10 h-10 text-sm rounded-xl',
  lg: 'w-12 h-12 text-base rounded-2xl',
  xl: 'w-16 h-16 text-lg rounded-2xl',
  '2xl': 'w-24 h-24 text-2xl rounded-3xl',
  '3xl': 'w-32 h-32 text-3xl rounded-3xl'
};

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  role,
  status,
  className = '',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials
  const getInitials = (n) => {
    if (!n || !n.trim()) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Compute deterministic gradient
  const getGradient = (n) => {
    let hash = 0;
    for (let i = 0; i < (n || '').length; i++) {
      hash = (n.charCodeAt(i) + ((hash << 5) - hash)) % GRADIENT_PALETTES.length;
    }
    return GRADIENT_PALETTES[Math.abs(hash) % GRADIENT_PALETTES.length];
  };

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const gradientClass = getGradient(name);
  const initials = getInitials(name);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden font-black text-white shadow-xs ${sizeClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center border border-white/20`}>
          <span>{initials}</span>
        </div>
      )}

      {/* Online indicator */}
      {status === 'online' && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" />
      )}
    </div>
  );
};
