import React from "react";
import { GoalType } from "@/types";
import { Hammer, BookOpen, Users, Compass, Network, Trophy } from "lucide-react";
import { clsx } from "clsx";

interface GoalOption {
  id: GoalType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tag: string;
}

const GOALS: GoalOption[] = [
  {
    id: "BUILD",
    title: "Build a Project",
    subtitle: "Launch a side project or assemble a competitive hackathon squad.",
    icon: <Hammer className="w-5 h-5" />,
    tag: "Action & Execution",
  },
  {
    id: "FIND_TEAM",
    title: "Find a Team",
    subtitle: "Join an existing high-ambition mission looking for your skill profile.",
    icon: <Users className="w-5 h-5" />,
    tag: "Collaboration Match",
  },
  {
    id: "LEARN",
    title: "Learn & Upskill",
    subtitle: "Join structured study pods, workshops, and beginner-welcoming tracks.",
    icon: <BookOpen className="w-5 h-5" />,
    tag: "Guided Pathways",
  },
  {
    id: "FIND_MENTOR",
    title: "Find a Mentor",
    subtitle: "Connect with senior engineers, founders, and alumni for guidance.",
    icon: <Compass className="w-5 h-5" />,
    tag: "Peer Advisory",
  },
  {
    id: "JOIN_COMMUNITY",
    title: "Join Communities",
    subtitle: "Discover active campus tech chapters, research labs, and clubs.",
    icon: <Network className="w-5 h-5" />,
    tag: "Ecosystem Hubs",
  },
  {
    id: "FIND_OPPORTUNITIES",
    title: "Find Opportunities",
    subtitle: "Discover hackathons, open-source bounties, and grants near you.",
    icon: <Trophy className="w-5 h-5" />,
    tag: "High-Signal Radar",
  },
];

interface GoalStepProps {
  selectedGoal: GoalType;
  onSelectGoal: (goal: GoalType) => void;
}

export function GoalStep({ selectedGoal, onSelectGoal }: GoalStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
          Step 01 / 04 • Core Intent
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1">
          What are you trying to accomplish right now?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your primary goal guides how NEXUS filters recommendations, matches teammates, and highlights opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <div
              key={goal.id}
              onClick={() => onSelectGoal(goal.id)}
              className={clsx(
                "p-4 rounded-xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between",
                isSelected
                  ? "bg-[#161C27] border-amber-500/50 shadow-md shadow-amber-950/20 ring-1 ring-amber-500/30"
                  : "bg-[#11141B] border-[#1E2530] hover:border-slate-700 hover:bg-[#141822]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={clsx(
                    "p-2 rounded-lg border",
                    isSelected
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-[#191F2B] text-slate-400 border-slate-800"
                  )}
                >
                  {goal.icon}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  {goal.tag}
                </span>
              </div>
              <div className="mt-3">
                <h3
                  className={clsx(
                    "text-sm font-semibold",
                    isSelected ? "text-amber-200" : "text-slate-200"
                  )}
                >
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {goal.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
