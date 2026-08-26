import React from "react";
import { PeerProfile, ScoreBreakdown } from "@/types";
import { useCommunity } from "@/context/CommunityContext";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface PeopleRelevanceCardProps {
  peer: PeerProfile;
  matchScore: number;
  breakdown?: ScoreBreakdown;
  reasons: string[];
}

export function PeopleRelevanceCard({ peer, matchScore, breakdown, reasons }: PeopleRelevanceCardProps) {
  const { setActiveScreen, setMatchQuery } = useCommunity();

  const handleInspect = () => {
    setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
    setActiveScreen("matchmaker");
  };

  return (
    <div className="rounded-xl bg-[#0C0F16] border border-[#1C2330] p-4 flex flex-col justify-between hover:border-[#283446] transition-all space-y-4 shadow-md">
      <div className="space-y-3">
        {/* Header with Avatar & Canonical Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#232B3A] shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-100 truncate">{peer.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono">{peer.handle}</span>
              </div>
              <p className="text-xs text-amber-400 font-mono truncate">{peer.headline}</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
            {matchScore}% Match
          </span>
        </div>

        {/* 4-Part Compact Score Formula Bar */}
        {breakdown && (
          <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-slate-400 bg-[#10141D] p-1.5 rounded-lg border border-[#1A212E] text-center">
            <div>
              <span className="text-slate-500 block">Comp</span>
              <span className="text-cyan-400 font-semibold">{breakdown.complementarity}/35</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sem</span>
              <span className="text-purple-400 font-semibold">{breakdown.semanticSimilarity}/30</span>
            </div>
            <div>
              <span className="text-slate-500 block">Avail</span>
              <span className="text-emerald-400 font-semibold">{breakdown.availability}/20</span>
            </div>
            <div>
              <span className="text-slate-500 block">PoW</span>
              <span className="text-amber-400 font-semibold">{breakdown.reputation}/15</span>
            </div>
          </div>
        )}

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1">
          {peer.skills.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="text-[10px] px-2 py-0.5 rounded bg-[#121622] text-slate-300 border border-[#1E2636] font-mono"
            >
              {s.name}
            </span>
          ))}
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#121622] text-rose-400 border border-[#1E2636] font-mono">
            {peer.availabilityHours}h/wk
          </span>
        </div>

        {/* Explicit "Recommended Because" Breakdown */}
        <div className="p-2.5 rounded-lg bg-[#10141E] border border-[#1A212E] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Recommended Because:
          </span>
          <ul className="space-y-0.5 text-xs text-slate-300">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-cyan-400 text-xs font-mono leading-tight">•</span>
                <span className="leading-snug">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 border-t border-[#181E2A]">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={handleInspect}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Inspect Compatibility Breakdown
        </Button>
      </div>
    </div>
  );
}
