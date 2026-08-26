"use client";

import React, { useState } from "react";
import { useCommunity } from "@/context/CommunityContext";
import { IntentSearchBar } from "./IntentSearchBar";
import { MatchResultCard } from "./MatchResultCard";
import { InviteMissionModal } from "./InviteMissionModal";
import { MatchRecommendation, SignalSource } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Send, Target, AlertCircle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

export function MatchmakerView() {
  const { matchQuery, parsedIntent, matchResults, searchMatches, sendInvitation, invitations } = useCommunity();
  const [selectedInviteMatch, setSelectedInviteMatch] = useState<MatchRecommendation | null>(null);

  const getSourceBadge = (source: SignalSource) => {
    switch (source) {
      case "explicit":
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
            [EXPLICIT]
          </span>
        );
      case "inferred":
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase font-semibold">
            [INFERRED]
          </span>
        );
      case "missing":
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-500 border border-slate-700 uppercase">
            [MISSING]
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-7">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1A212E] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Screen 04 • Query-Sensitive Matchmaker
            </span>
            <Badge variant="emerald" size="sm" dot>
              Signal Integrity Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            People & Teammate Matchmaker
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Query across the community in plain English. NEXUS distinguishes explicit vs. inferred signals and calculates compatibility without penalizing unstated criteria.
          </p>
        </div>

        {invitations.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10141E] border border-[#1E2738] text-xs font-mono text-cyan-300">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>{invitations.length} Active Invitation{invitations.length > 1 ? "s" : ""} Dispatched</span>
          </div>
        )}
      </div>

      {/* 1. Natural Language Intent Search Box */}
      <IntentSearchBar query={matchQuery} onSearch={searchMatches} />

      {/* 2. Structured "REQUEST PROFILE" with Signal Integrity Indicators */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0F16] border border-[#1C2330] space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1A212E] pb-2.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              REQUEST PROFILE (SIGNAL INTEGRITY)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Signals: </span>
            <span className="text-emerald-400">Explicit</span>
            <span>•</span>
            <span className="text-amber-400">Inferred</span>
            <span>•</span>
            <span className="text-slate-500">Missing</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          {/* Role */}
          <div className="p-3 rounded-xl bg-[#10141D] border border-[#1A212E] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase">Role</span>
              {getSourceBadge(parsedIntent.role.source)}
            </div>
            <span
              className={clsx(
                "font-semibold block truncate",
                parsedIntent.role.source === "missing" ? "text-slate-500 italic" : "text-slate-100"
              )}
            >
              {parsedIntent.role.displayText}
            </span>
          </div>

          {/* Domain */}
          <div className="p-3 rounded-xl bg-[#10141D] border border-[#1A212E] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase">Domain</span>
              {getSourceBadge(parsedIntent.domain.source)}
            </div>
            <span
              className={clsx(
                "font-semibold block truncate",
                parsedIntent.domain.source === "missing" ? "text-slate-500 italic" : "text-emerald-400"
              )}
            >
              {parsedIntent.domain.displayText}
            </span>
          </div>

          {/* Skills */}
          <div className="p-3 rounded-xl bg-[#10141D] border border-[#1A212E] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase">Skills</span>
              {getSourceBadge(parsedIntent.skills.source)}
            </div>
            <span
              className={clsx(
                "font-semibold block truncate",
                parsedIntent.skills.source === "missing" ? "text-slate-500 italic" : "text-cyan-400"
              )}
            >
              {parsedIntent.skills.displayText}
            </span>
          </div>

          {/* Bandwidth */}
          <div className="p-3 rounded-xl bg-[#10141D] border border-[#1A212E] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase">Bandwidth</span>
              {getSourceBadge(parsedIntent.bandwidth.source)}
            </div>
            <span
              className={clsx(
                "font-semibold block truncate",
                parsedIntent.bandwidth.source === "missing" ? "text-slate-500 italic" : "text-rose-400"
              )}
            >
              {parsedIntent.bandwidth.displayText}
            </span>
          </div>

          {/* Project */}
          <div className="p-3 rounded-xl bg-[#10141D] border border-[#1A212E] space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase">Project</span>
              {getSourceBadge(parsedIntent.project.source)}
            </div>
            <span
              className={clsx(
                "font-semibold block truncate",
                parsedIntent.project.source === "missing" ? "text-slate-500 italic" : "text-amber-400"
              )}
            >
              {parsedIntent.project.displayText}
            </span>
          </div>
        </div>
      </div>

      {/* 3. COMPUTED MATCHES List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              RANKED COMPATIBILITY MATCHES ({matchResults.length})
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Dynamically evaluated with 35% Complementarity + 30% Semantic Fit + 20% Availability + 15% Reputation
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-bold">
            Top Match: {matchResults[0]?.compatibilityScore || 0}% ({matchResults[0]?.candidate.name})
          </span>
        </div>

        {/* Match Result Cards List */}
        <div className="grid grid-cols-1 gap-5">
          {matchResults.map((match) => (
            <MatchResultCard
              key={match.id}
              match={match}
              onInvite={(candidateMatch) => setSelectedInviteMatch(candidateMatch)}
            />
          ))}
        </div>
      </div>

      {/* 4. Active Outgoing Invitations Summary */}
      {invitations.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0D1017] border border-[#1C2330] space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            Dispatched Mission Invitations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {invitations.map((inv, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#121622] border border-[#1E2636] space-y-1.5 text-xs text-slate-300"
              >
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span className="text-cyan-400 font-semibold">{inv.candidateName}</span>
                  <span>{inv.timestamp}</span>
                </div>
                <div className="font-semibold text-slate-100">{inv.role}</div>
                <div className="text-xs text-slate-400 line-clamp-2 italic">
                  "{inv.message}"
                </div>
                <div className="text-[10px] text-emerald-400 font-mono pt-1">
                  Status: Pending Peer Acceptance ({inv.hours}h/wk committed)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteMissionModal
        match={selectedInviteMatch}
        onClose={() => setSelectedInviteMatch(null)}
        onConfirmInvite={sendInvitation}
      />
    </div>
  );
}
