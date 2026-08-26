"use client";

import React from "react";
import { UserCommunityIdentity } from "@/types";
import { useCommunity } from "@/context/CommunityContext";
import { clsx } from "clsx";

interface ConstellationNode {
  id: string;
  label: string;
  type: "user" | "skill" | "interest" | "project" | "peer" | "goal";
  x: number;
  y: number;
  radius: number;
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
}

interface IdentityConstellationCanvasProps {
  identity: UserCommunityIdentity;
  onSelectNode: (node: ConstellationNode | null) => void;
  selectedNodeId: string | null;
}

export function IdentityConstellationCanvas({
  identity,
  onSelectNode,
  selectedNodeId,
}: IdentityConstellationCanvasProps) {
  const { matchResults } = useCommunity();
  const cx = 350;
  const cy = 260;

  // Find top peer match dynamically
  const topPeerMatch = matchResults.find((m) => m.candidate.id === "peer_priya") || matchResults[0];
  const peerScore = topPeerMatch ? topPeerMatch.compatibilityScore : 94;
  const peerBreakdown = topPeerMatch ? topPeerMatch.breakdown : {
    complementarity: 35,
    semanticSimilarity: 27,
    availability: 18,
    reputation: 14,
    total: 94,
  };

  // Build the node cluster surrounding the user
  const nodes: ConstellationNode[] = [
    // Epicenter: User
    {
      id: "node_user",
      label: identity.name,
      type: "user",
      x: cx,
      y: cy,
      radius: 28,
      color: "#F59E0B", // Amber
      details: {
        title: `${identity.name} (Ecosystem Epicenter)`,
        subtitle: `${identity.headline} • ${identity.availabilityHours}h/w`,
        description: identity.activeIntent || identity.bio,
        metrics: `${identity.experienceLevel} Level • Available ${identity.availabilityHours}h/wk`,
      },
    },
    // Primary Goal Node
    {
      id: "node_goal",
      label: `Goal: ${identity.primaryGoal}`,
      type: "goal",
      x: cx,
      y: cy - 160,
      radius: 20,
      color: "#F59E0B",
      details: {
        title: `Primary Trajectory: ${identity.primaryGoal}`,
        subtitle: "Active Mission Direction",
        description:
          "All incoming community telemetry is filtered through this target to surface relevant project openings and teammate vacancies.",
        metrics: "High Priority Signal",
      },
    },
    // Skills (Left orbit)
    ...identity.skills.slice(0, 4).map((skill, index) => {
      const angles = [-140, -170, -110, -80];
      const rad = (angles[index] * Math.PI) / 180;
      const dist = 160;
      return {
        id: `node_skill_${skill.id}`,
        label: skill.name,
        type: "skill" as const,
        x: cx + Math.cos(rad) * dist,
        y: cy + Math.sin(rad) * dist,
        radius: 17,
        color: "#06B6D4", // Cyan
        details: {
          title: `Skill: ${skill.name} (${skill.level})`,
          subtitle: `${skill.category} Capability`,
          description: `Tagged as ${skill.level} proficiency. Multiple active projects in NEXUS require this capability.`,
          metrics: "Verified In-Demand",
          actionLabel: "Find Teams Needing This Skill",
          actionTarget: "matchmaker",
        },
      };
    }),
    // Interests (Top-right orbit)
    ...identity.interests.slice(0, 3).map((interest, index) => {
      const angles = [-40, -10, 20];
      const rad = (angles[index] * Math.PI) / 180;
      const dist = 170;
      return {
        id: `node_interest_${index}`,
        label: interest,
        type: "interest" as const,
        x: cx + Math.cos(rad) * dist,
        y: cy + Math.sin(rad) * dist,
        radius: 16,
        color: "#10B981", // Emerald
        details: {
          title: `Domain: ${interest}`,
          subtitle: "Technical Frontier",
          description: `Active research & problem domain. Links your identity to active hackathons and collaborators.`,
          metrics: "Domain Affinity",
        },
      };
    }),
    // Connected Active Project (Bottom right)
    {
      id: "node_proj_neuro",
      label: "NeuroTriage AI",
      type: "project",
      x: cx + 140,
      y: cy + 130,
      radius: 22,
      color: "#F43F5E", // Rose
      details: {
        title: "Active Project: NeuroTriage AI",
        subtitle: "HackHealth 2026 Track • 36h Remaining",
        description:
          "Autonomous medical triage engine. Currently recruiting 1 Lead React/Tailwind frontend developer.",
        metrics: "Recruiting 1 Role",
        actionLabel: "Find Teammates for this Mission",
        actionTarget: "matchmaker",
      },
    },
    // Matched Collaborator (Bottom left) with Dynamic Canonical Score
    {
      id: "node_peer_priya",
      label: `${topPeerMatch?.candidate.name || "Priya Shah"} (${peerScore}%)`,
      type: "peer",
      x: cx - 130,
      y: cy + 130,
      radius: 21,
      color: "#8B5CF6", // Violet
      details: {
        title: `Recommended Collaborator: ${topPeerMatch?.candidate.name || "Priya Shah"}`,
        subtitle: `${topPeerMatch?.candidate.headline || "Product Designer"} • ${peerScore}% Compatibility`,
        description:
          topPeerMatch?.whyThisWorks.theyOffer ||
          "Complementary frontend match for NeuroTriage AI.",
        metrics: `${peerScore}% Dynamic Compatibility`,
        scoreBreakdown: {
          comp: `${peerBreakdown.complementarity}/35`,
          sem: `${peerBreakdown.semanticSimilarity}/30`,
          avail: `${peerBreakdown.availability}/20`,
          pow: `${peerBreakdown.reputation}/15`,
        },
        actionLabel: "Inspect Match Rationale",
        actionTarget: "matchmaker",
      },
    },
  ];

  return (
    <div className="relative w-full h-[520px] bg-[#070A0F] rounded-2xl border border-[#1C2330] overflow-hidden flex items-center justify-center select-none shadow-2xl">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121622_1px,transparent_1px),linear-gradient(to_bottom,#121622_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Radial Glow Center */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 700 520"
        className="w-full h-full relative z-10"
        onClick={() => onSelectNode(null)}
      >
        {/* Orbital Distance Rings */}
        <circle cx={cx} cy={cy} r="90" fill="none" stroke="#1A222E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx={cx} cy={cy} r="165" fill="none" stroke="#18202C" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

        {/* Constellation Link Lines */}
        {nodes.map((node) => {
          if (node.id === "node_user") return null;
          const isSelected = selectedNodeId === node.id;
          return (
            <g key={`edge_${node.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={isSelected ? node.color : "#222B3A"}
                strokeWidth={isSelected ? 2 : 1.2}
                strokeDasharray={node.type === "peer" ? "4 3" : undefined}
                opacity={isSelected ? 1 : 0.7}
              />
            </g>
          );
        })}

        {/* Secondary Cross Link between Project and Peer */}
        <line
          x1={cx + 140}
          y1={cy + 130}
          x2={cx - 130}
          y2={cy + 130}
          stroke="#8B5CF6"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.5"
        />

        {/* Interactive Constellation Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isUser = node.type === "user";

          return (
            <g
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              className="cursor-pointer group"
            >
              {/* Outer Pulse Halo for selected or user node */}
              {(isSelected || isUser) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 7}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-pulse"
                />
              )}

              {/* Node Solid Body */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill="#0E121A"
                stroke={isSelected ? node.color : isUser ? "#F59E0B" : "#242D3D"}
                strokeWidth={isSelected || isUser ? 2.5 : 1.5}
                className="transition-all duration-200 group-hover:stroke-amber-400 group-hover:scale-105"
              />

              {/* Inner Node Accent Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * 0.4}
                fill={node.color}
                opacity={isSelected ? 1 : 0.8}
              />

              {/* Node Text Label */}
              <text
                x={node.x}
                y={node.y + node.radius + 14}
                textAnchor="middle"
                className={clsx(
                  "text-[10px] font-mono tracking-tight select-none transition-colors",
                  isSelected
                    ? "fill-amber-300 font-bold"
                    : isUser
                    ? "fill-slate-100 font-bold"
                    : "fill-slate-400 group-hover:fill-slate-200"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Instructions Pill Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#0C0F16]/95 border border-[#1C2330] text-slate-400">
          Click any node to inspect relationship telemetry
        </span>
      </div>
    </div>
  );
}
