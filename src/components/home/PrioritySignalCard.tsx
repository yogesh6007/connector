import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PrioritySignalCard() {
  const { setActiveScreen, setMatchQuery, matchResults } = useCommunity();

  const topMatch1 = matchResults[0];
  const topMatch2 = matchResults[1];

  const handleMatchAction = () => {
    setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
    setActiveScreen("matchmaker");
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#151210] via-[#131720] to-[#10141C] border border-amber-500/40 p-5 sm:p-6 shadow-xl shadow-amber-950/20 overflow-hidden">
      {/* Subtle Amber Beacon Pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Highest Attention Priority
            </span>
            <span className="text-xs text-rose-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 36 Hours Left • HackHealth 2026
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
            NeuroTriage AI is ready for deployment, but requires 1 Lead Frontend / Figma collaborator.
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300">Why this matters:</strong> You have completed the PyTorch computer vision inference pipeline. High-compatibility candidates ({topMatch1?.candidate.name || "Priya Shah"} {topMatch1?.compatibilityScore || 94}%, {topMatch2?.candidate.name || "Sneha Kulkarni"} {topMatch2?.compatibilityScore || 89}%) are currently available before submissions lock.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full md:w-auto"
            onClick={handleMatchAction}
            icon={<Zap className="w-4 h-4" />}
          >
            Review Matched Candidates
          </Button>
        </div>
      </div>
    </div>
  );
}
