import React from 'react';
import { clsx } from 'clsx';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex space-x-1 border-b border-slate-200 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map(tab => {
        const key = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : null;
        const Icon = typeof tab === 'object' ? tab.icon : null;
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={clsx(
              'flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150',
              isActive
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            )}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />}
            <span>{label}</span>
            {count !== null && count !== undefined && (
              <span
                className={clsx(
                  'px-2 py-0.5 text-xs font-semibold rounded-full',
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
