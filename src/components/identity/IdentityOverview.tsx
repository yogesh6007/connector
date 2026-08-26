"use client";

import React, { useState } from "react";
import { useCommunity } from "@/context/CommunityContext";
import { IdentityConstellationCanvas } from "./IdentityConstellationCanvas";
import { NodeDetailsPanel } from "./NodeDetailsPanel";
import { Button } from "@/components/ui/Button";
import { Sparkles, Network, UserCheck, ArrowRight, ShieldCheck, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function IdentityOverview() {
  const { identity, setActiveScreen } = useCommunity();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1E2532] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Screen 02 • Community Identity Node
            </span>
            <Badge variant="amber" size="sm" dot>
              Live Constellation
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">
            {identity.name}'s Neural Capability Map
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            This graph defines how the NEXUS intelligence engine sees your skills, domain affinities, current mission goals, and collaborative synergy across communities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveScreen("onboarding")}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Re-tune Identity
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveScreen("home")}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Attention Stream
          </Button>
        </div>
      </div>

      {/* Main Grid: Constellation Canvas + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <IdentityConstellationCanvas
            identity={identity}
            onSelectNode={(node) => setSelectedNode(node)}
            selectedNodeId={selectedNode ? selectedNode.id : null}
          />
        </div>

        <div className="lg:col-span-4 sticky top-24">
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      </div>

      {/* Bottom Identity Summary Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-[#0E121A] border border-[#1E2532] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
              Capability Stack
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {identity.skills.length} skills
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {identity.skills.map((s) => (
              <span
                key={s.id}
                className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono"
              >
                {s.name} <span className="text-slate-400">({s.level})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121A] border border-[#1E2532] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
              Domain Frontiers
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {identity.interests.length} domains
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {identity.interests.map((dom) => (
              <span
                key={dom}
                className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              >
                {dom}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121A] border border-[#1E2532] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
              Bandwidth & Karma
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Verified Proof</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>Availability</span>
            <span className="text-rose-400 font-bold">{identity.availabilityHours}h / week</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>Community Karma</span>
            <span className="text-amber-400 font-bold">★ {identity.karmaPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
