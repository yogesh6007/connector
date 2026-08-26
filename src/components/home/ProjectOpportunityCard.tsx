import React from "react";
import { ProjectOpportunity } from "@/types";
import { useCommunity } from "@/context/CommunityContext";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users } from "lucide-react";

interface ProjectOpportunityCardProps {
  project: ProjectOpportunity;
}

export function ProjectOpportunityCard({ project }: ProjectOpportunityCardProps) {
  const { setActiveScreen, setMatchQuery } = useCommunity();

  const handleApplyOrView = () => {
    setMatchQuery("I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.");
    setActiveScreen("matchmaker");
  };

  return (
    <div className="rounded-xl bg-[#0C0F16] border border-[#1C2330] p-4 flex flex-col justify-between hover:border-[#283446] hover:bg-[#0F131C] transition-all space-y-4 shadow-md">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
              {project.communityName}
            </span>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">{project.title}</h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
            {project.relevanceScore}% Fit
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {project.mission}
        </p>

        {/* Open Roles Pill */}
        <div className="space-y-1.5 p-2.5 rounded-lg bg-[#10141E] border border-[#1A212E]">
          <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3 text-rose-400" />
            Open Vacancy:
          </span>
          {project.openRoles.map((role, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-slate-200">
              <span className="font-medium text-slate-300 truncate">{role.roleTitle}</span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {role.hoursPerWeek}h/wk
              </span>
            </div>
          ))}
        </div>

        {/* Why Recommended */}
        <div className="text-xs text-slate-300 bg-[#10141E] p-2.5 rounded-lg border border-[#1A212E]">
          <span className="text-amber-400 font-semibold font-mono text-[10px] uppercase block mb-0.5">
            Relevance Reason:
          </span>
          {project.relevanceReason}
        </div>
      </div>

      <div className="pt-2 border-t border-[#181E2A]">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={handleApplyOrView}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Team & Join Mission
        </Button>
      </div>
    </div>
  );
}
