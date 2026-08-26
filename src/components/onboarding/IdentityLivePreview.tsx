import React from "react";
import { UserCommunityIdentity } from "@/types";
import { Sparkles, Network, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface IdentityLivePreviewProps {
  identity: UserCommunityIdentity;
}

export function IdentityLivePreview({ identity }: IdentityLivePreviewProps) {
  return (
    <div className="rounded-2xl bg-[#0D1017] border border-[#1E2532] p-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Neural Node Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-[#1C222E] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Live Constellation Synthesizer
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            Node Preview
          </span>
        </div>

        {/* User Identity Core Capsule */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141923] border border-[#222B3A]">
          <img
            src={identity.avatar}
            alt={identity.name}
            className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 shrink-0"
          />
          <div className="truncate">
            <h3 className="text-sm font-bold text-slate-100 truncate">
              {identity.name || "Anonymous Builder"}
            </h3>
            <p className="text-xs text-amber-400 font-mono truncate">
              {identity.headline || "Configuring Identity..."}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-mono">
                {identity.experienceLevel}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-rose-400 font-mono">
                {identity.availabilityHours}h/wk
              </span>
            </div>
          </div>
        </div>

        {/* Primary Goal Pill */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Primary Trajectory
          </span>
          <div className="p-2.5 rounded-lg bg-[#111620] border border-[#1D2533] flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              {identity.primaryGoal}
            </span>
            <Badge variant="amber" size="sm">
              Active Intent
            </Badge>
          </div>
        </div>

        {/* Skills Constellation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500">
              Skills ({identity.skills.length})
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Capability Node</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {identity.skills.length === 0 ? (
              <span className="text-xs text-slate-600 italic">No skills tagged yet</span>
            ) : (
              identity.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono"
                >
                  {s.name} <span className="text-slate-400 text-[9px]">({s.level[0]})</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Interests & Domains */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Domain Affinity ({identity.interests.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {identity.interests.length === 0 ? (
              <span className="text-xs text-slate-600 italic">No domains selected</span>
            ) : (
              identity.interests.map((dom) => (
                <span
                  key={dom}
                  className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  {dom}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Active Pitch */}
        {identity.activeIntent && (
          <div className="p-2.5 rounded-lg bg-[#111620] border border-[#1D2533] space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">
              Active Broadcast Intent
            </span>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
              "{identity.activeIntent}"
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#1C222E] mt-4 relative z-10">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Identity Graph Integrity</span>
          <span className="font-mono text-emerald-400 font-semibold">Ready to Bind</span>
        </div>
      </div>
    </div>
  );
}
