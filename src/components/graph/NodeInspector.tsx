import React from "react";
import { GraphNode } from "@/types";
import { useCommunity, ScreenType } from "@/context/CommunityContext";
import { Button } from "@/components/ui/Button";
import { X, ArrowRight, UserCheck, Activity, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface NodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
}

export function NodeInspector({ node, onClose }: NodeInspectorProps) {
  const { setActiveScreen, setMatchQuery } = useCommunity();

  if (!node) {
    return (
      <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2330] p-5 flex flex-col items-center justify-center text-center h-[580px] text-slate-500 space-y-2.5">
        <Activity className="w-8 h-8 text-slate-600 animate-pulse mb-1" />
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase">
          Spatial Node Inspector
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Select any person, project, community, or skill node in the spatial graph to inspect relationship depth, compatibility vectors, and collaboration actions.
        </p>
      </div>
    );
  }

  const isPeer = node.type === "peer";
  const isProject = node.type === "project";
  const isSkill = node.type === "skill";
  const scoreBreakdown = node.data?.scoreBreakdown;

  const handleAction = () => {
    if (isPeer) {
      setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
      setActiveScreen("matchmaker");
    } else if (isProject) {
      setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
      setActiveScreen("matchmaker");
    } else if (isSkill) {
      setMatchQuery(`Find people and projects requiring ${node.label}`);
      setActiveScreen("matchmaker");
    }
  };

  return (
    <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2330] p-5 flex flex-col justify-between h-[580px] relative overflow-hidden shadow-2xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#1A212E] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Node Type: {node.type.toUpperCase()} • {node.cluster}
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">{node.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar or Subtitle Pill */}
        {node.data?.avatar && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111520] border border-[#1E2636]">
            <img
              src={node.data.avatar}
              alt={node.label}
              className="w-11 h-11 rounded-xl object-cover border border-cyan-400/40 shrink-0"
            />
            <div className="truncate">
              <span className="text-xs text-amber-400 font-mono block truncate">
                {node.data.subtitle}
              </span>
              {node.data.matchScore && (
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  ★ {node.data.matchScore}% Canonical Compatibility
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4-Part Formula Breakdown if Available */}
        {scoreBreakdown && (
          <div className="p-3 rounded-xl bg-[#10141E] border border-[#1C2434] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Compatibility Breakdown:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Comp (35%):</span>
                <span className="text-cyan-400 font-bold">{scoreBreakdown.complementarity}/35</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Sem (30%):</span>
                <span className="text-purple-400 font-bold">{scoreBreakdown.semanticSimilarity}/30</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Avail (20%):</span>
                <span className="text-emerald-400 font-bold">{scoreBreakdown.availability}/20</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">PoW (15%):</span>
                <span className="text-amber-400 font-bold">{scoreBreakdown.reputation}/15</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {node.data?.description && (
          <div className="p-3.5 rounded-xl bg-[#10141E] border border-[#1A212E] text-xs text-slate-300 leading-relaxed">
            {node.data.description}
          </div>
        )}

        {/* Project Open Roles if Applicable */}
        {node.data?.openRoles && (
          <div className="space-y-1.5 p-3 rounded-xl bg-[#121622] border border-[#1E2636]">
            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
              Active Vacancies ({node.data.openRoles.length})
            </span>
            <div className="space-y-1">
              {node.data.openRoles.map((role, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>• {role}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Open</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Network Connectivity Vector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
            Graph Connectivity Telemetry
          </span>
          <div className="p-2.5 rounded-lg bg-[#0F131C] border border-[#1A212E] text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Cluster Density:</span>
              <span className="text-slate-200">High (12 Connections)</span>
            </div>
            <div className="flex justify-between">
              <span>Shortest Path to You:</span>
              <span className="text-cyan-400">1 Hop (Direct Synergies)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-[#1A212E]">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleAction}
          icon={isPeer ? <UserCheck className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        >
          {isPeer
            ? `Invite ${node.label.split(" ")[0]} to Mission`
            : isProject
            ? "Apply for Open Role"
            : `Search Matches with ${node.label}`}
        </Button>
      </div>
    </div>
  );
}
