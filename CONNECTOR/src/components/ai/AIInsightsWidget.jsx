import React from 'react';
import { Sparkles, Cpu, Users, Layers, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AIInsightsWidget = ({ insights, className = '' }) => {
  if (!insights) return null;

  const {
    complexity = 'Advanced',
    suggestedTeamSize = '4-5 members',
    domainCategory = 'Artificial Intelligence',
    keyTechnologies = [],
    readinessScore = 88,
    summary
  } = insights;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl relative overflow-hidden ${className}`}>
      {/* Decorative glowing orb */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">AI Project Intelligence</h4>
            <p className="text-[11px] text-purple-200/70">Real-time architecture assessment</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{readinessScore}% Scope Readiness</span>
        </div>
      </div>

      {summary && (
        <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
          {summary}
        </p>
      )}

      {/* Grid Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-medium mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Complexity</span>
          </div>
          <p className="text-xs font-bold text-white">{complexity}</p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-medium mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Ideal Team Size</span>
          </div>
          <p className="text-xs font-bold text-white">{suggestedTeamSize}</p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-medium mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Domain Cluster</span>
          </div>
          <p className="text-xs font-bold text-white truncate">{domainCategory}</p>
        </div>
      </div>

      {keyTechnologies.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[11px] font-semibold text-purple-200/80 mb-2">Recommended Tech Stack Integration:</p>
          <div className="flex flex-wrap gap-1.5">
            {keyTechnologies.map(tech => (
              <span
                key={tech}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white font-medium border border-white/15"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
