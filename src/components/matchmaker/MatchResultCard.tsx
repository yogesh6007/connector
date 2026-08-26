"use client";

import React, { useState } from "react";
import { MatchRecommendation } from "@/types";
import { Button } from "@/components/ui/Button";
import { Sparkles, Send, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { clsx } from "clsx";

interface MatchResultCardProps {
  match: MatchRecommendation;
  onInvite: (candidate: MatchRecommendation) => void;
}

export function MatchResultCard({ match, onInvite }: MatchResultCardProps) {
  const { candidate, compatibilityScore, breakdown, complementarySkills, sharedInterests, whyThisWorks, whyLower } = match;
  const [showGaps, setShowGaps] = useState(false);

  return (
    <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2332] p-5 sm:p-6 flex flex-col justify-between hover:border-[#283446] transition-all space-y-4 shadow-xl">
      <div className="space-y-4">
        {/* Header: Candidate Info & Compatibility Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A212E] pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#232B3A] shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{candidate.name}</h3>
                <span className="text-xs text-slate-500 font-mono">{candidate.handle}</span>
              </div>
              <p className="text-xs text-amber-400 font-mono mt-0.5">{candidate.headline}</p>
              <div className="flex items-center gap-2 mt-1">
                {candidate.verifiedBadges.slice(0, 2).map((b, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono"
                  >
                    ★ {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Compatibility Score & Total */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-center">
              <span className="text-2xl font-bold block leading-none">{compatibilityScore}%</span>
              <span className="text-[9px] uppercase tracking-wider block text-emerald-400/90 font-semibold mt-1">
                Compatibility
              </span>
            </div>
          </div>
        </div>

        {/* 4-Part Transparent Score Breakdown */}
        <div className="p-3 rounded-xl bg-[#10141D] border border-[#1C2433] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-slate-300">
              Deterministic Compatibility Formula:
            </span>
            <span className="text-amber-400 font-bold">
              {breakdown.complementarity} + {breakdown.semanticSimilarity} + {breakdown.availability} + {breakdown.reputation} = {breakdown.total}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#0D1017] border border-[#1A212E] space-y-0.5">
              <span className="text-[10px] text-slate-500 block uppercase">Complementarity (35%)</span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">{breakdown.complementarity} / 35</span>
                <span className="text-[10px] text-slate-500">{Math.round((breakdown.complementarity / 35) * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#0D1017] border border-[#1A212E] space-y-0.5">
              <span className="text-[10px] text-slate-500 block uppercase">Semantic Fit (30%)</span>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">{breakdown.semanticSimilarity} / 30</span>
                <span className="text-[10px] text-slate-500">{Math.round((breakdown.semanticSimilarity / 30) * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#0D1017] border border-[#1A212E] space-y-0.5">
              <span className="text-[10px] text-slate-500 block uppercase">Availability (20%)</span>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">{breakdown.availability} / 20</span>
                <span className="text-[10px] text-slate-500">{Math.round((breakdown.availability / 20) * 100)}%</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#0D1017] border border-[#1A212E] space-y-0.5">
              <span className="text-[10px] text-slate-500 block uppercase">Proof of Work (15%)</span>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold">{breakdown.reputation} / 15</span>
                <span className="text-[10px] text-slate-500">{Math.round((breakdown.reputation / 15) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Way "WHY THIS MATCHES" Bidirectional Rationale */}
        <div className="rounded-xl bg-[#11151F] border border-[#1D2534] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              WHY THIS MATCHES (Bidirectional Synergies)
            </span>
            <span className="text-[10px] font-mono text-slate-400">2-Way Need / Offer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* What You Need vs They Offer */}
            <div className="p-3 rounded-lg bg-[#0E1118] border border-[#1A212E] space-y-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">
                WHAT YOU NEED → WHAT {candidate.name.split(" ")[0]} BRINGS
              </span>
              <p className="text-slate-300 leading-snug">{whyThisWorks.theyOffer}</p>
            </div>

            {/* What Candidate Needs vs You Offer */}
            <div className="p-3 rounded-lg bg-[#0E1118] border border-[#1A212E] space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                WHAT {candidate.name.split(" ")[0]} NEEDS → WHAT YOU BRING
              </span>
              <p className="text-slate-300 leading-snug">{whyThisWorks.youOffer}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2 pt-1 font-mono">
            <span>Context: <span className="text-slate-200">{whyThisWorks.sharedContext}</span></span>
            <span className="text-rose-400 font-bold">
              Bandwidth: {candidate.availabilityHours}h/wk available
            </span>
          </div>
        </div>

        {/* Expandable "WHY LOWER / MATCHING GAPS" Section */}
        {whyLower && (
          <div className="border-t border-[#181E2A] pt-2">
            <button
              onClick={() => setShowGaps(!showGaps)}
              className="flex items-center justify-between w-full text-xs font-mono text-slate-400 hover:text-slate-200 py-1"
            >
              <span>{showGaps ? "Hide Diagnostic Evidence" : "Inspect Matching Evidence & Score Details"}</span>
              {showGaps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showGaps && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                {/* Positive Evidence */}
                <div className="p-2.5 rounded-lg bg-[#0E131C] border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
                    Positive Evidence (Score Drivers)
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {whyLower.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Score Gaps */}
                <div className="p-2.5 rounded-lg bg-[#140F13] border border-rose-500/20 space-y-1">
                  <span className="text-[10px] uppercase text-rose-400 font-semibold block">
                    Gaps & Unmatched Attributes
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {whyLower.gaps.length === 0 ? (
                      <li className="text-slate-500 italic text-[11px]">No significant gaps identified.</li>
                    ) : (
                      whyLower.gaps.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <X className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Action CTA */}
      <div className="pt-3 border-t border-[#1A212E] flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-slate-400 font-mono">
          <span>Candidate Intent: </span>
          <span className="text-slate-300 italic">"{candidate.activeIntent}"</span>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onInvite(match)}
          icon={<Send className="w-4 h-4" />}
        >
          Invite to Mission
        </Button>
      </div>
    </div>
  );
}
