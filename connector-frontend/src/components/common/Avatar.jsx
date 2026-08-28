import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  online = null,
  className = ''
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl font-bold'
  };

  const indicatorSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-1 right-1',
    '2xl': 'w-5 h-5 bottom-1.5 right-1.5'
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizes[size] || sizes.md} rounded-full object-cover ring-2 ring-white shadow-sm`}
        />
      ) : (
        <div
          className={`${sizes[size] || sizes.md} rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center ring-2 ring-white shadow-sm`}
        >
          {getInitials(name || alt)}
        </div>
      )}

      {online !== null && (
        <span
          className={`absolute rounded-full border-2 border-white ${
            online ? 'bg-emerald-500' : 'bg-slate-300'
          } ${indicatorSizes[size] || indicatorSizes.md}`}
        />
      )}
    </div>
  );
}
