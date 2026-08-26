import React from "react";
import { useCommunity, ScreenType } from "@/context/CommunityContext";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, X, Activity } from "lucide-react";

interface NodeDetailsPanelProps {
  node: {
    id: string;
    label: string;
    type: string;
    color: string;
    details: {
      title: string;
      subtitle: string;
      description: string;
      metrics?: string;
      scoreBreakdown?: {
        comp: string;
        sem: string;
        avail: string;
        pow: string;
      };
      actionLabel?: string;
      actionTarget?: string;
    };
  } | null;
  onClose: () => void;
}

export function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  const { setActiveScreen, setMatchQuery } = useCommunity();

  if (!node) {
    return (
      <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2330] p-5 flex flex-col items-center justify-center text-center h-[520px] text-slate-500 space-y-2">
        <Activity className="w-8 h-8 text-slate-600 mb-1 animate-pulse" />
        <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Node Inspector Idle</p>
        <p className="text-[11px] text-slate-500 max-w-xs">
          Click any skill, domain, goal, project, or collaborator node in your constellation to inspect live connections and actions.
        </p>
      </div>
    );
  }

  const handleAction = () => {
    if (node.details.actionTarget) {
      if (node.type === "peer") {
        setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
      }
      setActiveScreen(node.details.actionTarget as ScreenType);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2330] p-5 flex flex-col justify-between h-[520px] relative overflow-hidden shadow-xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#1A212E] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Constellation Node Telemetry
            </span>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">
              {node.details.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle / Metrics Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2.5 py-0.5 rounded bg-[#121622] text-slate-300 border border-[#1E2636] font-mono">
            {node.details.subtitle}
          </span>
          {node.details.metrics && (
            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              {node.details.metrics}
            </span>
          )}
        </div>

        {/* 4-Part Formula Breakdown if Available */}
        {node.details.scoreBreakdown && (
          <div className="p-3 rounded-xl bg-[#10141E] border border-[#1C2434] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Deterministic Compatibility Formula:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Comp (35%):</span>
                <span className="text-cyan-400 font-bold">{node.details.scoreBreakdown.comp}</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Sem (30%):</span>
                <span className="text-purple-400 font-bold">{node.details.scoreBreakdown.sem}</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">Avail (20%):</span>
                <span className="text-emerald-400 font-bold">{node.details.scoreBreakdown.avail}</span>
              </div>
              <div className="p-1.5 rounded bg-[#0D1017] border border-[#19202D] flex justify-between">
                <span className="text-slate-500">PoW (15%):</span>
                <span className="text-amber-400 font-bold">{node.details.scoreBreakdown.pow}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description Body */}
        <div className="p-3 rounded-xl bg-[#10141E] border border-[#1A212E] text-xs text-slate-300 leading-relaxed">
          {node.details.description}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#1A212E]">
        {node.details.actionLabel ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleAction}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {node.details.actionLabel}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setActiveScreen("home")}
            icon={<Sparkles className="w-4 h-4" />}
          >
            View Active Signals in Home
          </Button>
        )}
      </div>
    </div>
  );
}
