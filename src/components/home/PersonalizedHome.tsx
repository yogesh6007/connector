"use client";

import React from "react";
import { useCommunity } from "@/context/CommunityContext";
import { PrioritySignalCard } from "./PrioritySignalCard";
import { PeopleRelevanceCard } from "./PeopleRelevanceCard";
import { ProjectOpportunityCard } from "./ProjectOpportunityCard";
import { EventSignalCard } from "./EventSignalCard";
import { CommunityPulseTicker } from "./CommunityPulseTicker";
import { Button } from "@/components/ui/Button";
import { Sparkles, Network, UserCheck, ArrowRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function PersonalizedHome() {
  const { identity, peers, matchResults, projects, events, signals, setActiveScreen } = useCommunity();

  // Use the canonical computed matches directly from the matching engine
  const topMatches = matchResults.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#1A212E] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Screen 01 • Attention Stream
            </span>
            <Badge variant="cyan" size="sm" dot>
              Realtime Filtering
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            What's Worth Your Attention Right Now?
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Ranked specifically for <span className="text-slate-200 font-semibold">{identity.name}</span> based on your PyTorch skills, Healthcare AI focus, and 12h/week bandwidth.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveScreen("graph")}
            icon={<Network className="w-3.5 h-3.5" />}
          >
            Explore Spatial Graph
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveScreen("matchmaker")}
            icon={<UserCheck className="w-3.5 h-3.5" />}
          >
            Launch Teammate Matchmaker
          </Button>
        </div>
      </div>

      {/* 1. High Urgency Priority Action */}
      <PrioritySignalCard />

      {/* 2. People You Should Meet (Canonical Compatibility Matches) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              People You Should Meet
            </h2>
            <p className="text-xs text-slate-400">
              Ranked by 4-part compatibility formula (35% Complementarity + 30% Semantic + 20% Availability + 15% Reputation).
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-amber-400 hover:text-amber-300 font-mono"
            onClick={() => setActiveScreen("matchmaker")}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Query All Matches
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topMatches.map((match) => (
            <PeopleRelevanceCard
              key={match.candidate.id}
              peer={match.candidate}
              matchScore={match.compatibilityScore}
              breakdown={match.breakdown}
              reasons={[
                match.whyThisWorks.theyOffer,
                match.whyThisWorks.sharedContext,
                `${match.availabilityOverlapHours}h/week availability overlap`,
              ]}
            />
          ))}
        </div>
      </div>

      {/* 3. Projects Seeking Your Exact Skills & Mission Vacancies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Projects You Could Join
            </h2>
            <p className="text-xs text-slate-400">
              Active missions with open roles matching your proficiency in AI/ML and Backend.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <ProjectOpportunityCard key={proj.id} project={proj} />
          ))}
        </div>
      </div>

      {/* 4. Events Worth Attending & Peer Density */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Events & Sprints Worth Your Time
          </h2>
          <p className="text-xs text-slate-400">
            Filtered by peer attendee density and skill growth pathways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <EventSignalCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>

      {/* 5. Live Community Pulse Stream */}
      <CommunityPulseTicker signals={signals} />
    </div>
  );
}
