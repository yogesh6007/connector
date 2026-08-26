import React from "react";
import { CollaborationStyle, ExperienceLevel } from "@/types";
import { Clock, Zap, MessageSquare, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

interface AvailabilityStepProps {
  hours: number;
  style: CollaborationStyle;
  activeIntent: string;
  name: string;
  headline: string;
  experienceLevel: ExperienceLevel;
  onUpdate: (data: {
    hours?: number;
    style?: CollaborationStyle;
    activeIntent?: string;
    name?: string;
    headline?: string;
    experienceLevel?: ExperienceLevel;
  }) => void;
}

const COLLAB_STYLES: CollaborationStyle[] = [
  "Fast-paced Hackathons",
  "Deep Research & Architecture",
  "Weekend Open-Source",
  "Casual Study Cohort",
];

const EXP_LEVELS: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced", "Lead"];

export function AvailabilityStep({
  hours,
  style,
  activeIntent,
  name,
  headline,
  experienceLevel,
  onUpdate,
}: AvailabilityStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
          Step 04 / 04 • Bandwidth & Pitch
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1">
          Finalize your collaboration identity
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Availability transparency eliminates ghosting and ensures realistic project commitments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name & Headline */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
            placeholder="e.g. Aarav Mehta"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Overall Experience Level</label>
          <select
            value={experienceLevel}
            onChange={(e) => onUpdate({ experienceLevel: e.target.value as ExperienceLevel })}
            className="w-full bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500 font-mono"
          >
            {EXP_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Professional Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          className="w-full bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500"
          placeholder="e.g. AI Systems Engineer & PyTorch Enthusiast"
        />
      </div>

      {/* Weekly Hours Slider */}
      <div className="p-3.5 rounded-xl bg-[#11141B] border border-[#1E2530] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-slate-200">
              Weekly Bandwidth Available
            </span>
          </div>
          <span className="text-sm font-mono font-bold text-rose-400">
            {hours} hours / week
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={30}
          step={2}
          value={hours}
          onChange={(e) => onUpdate({ hours: parseInt(e.target.value) })}
          className="w-full accent-rose-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>2h (Casual)</span>
          <span>12h (Active Hackathon)</span>
          <span>30h (Full Sprint)</span>
        </div>
      </div>

      {/* Collaboration Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Preferred Collaboration Pace</label>
        <div className="grid grid-cols-2 gap-2">
          {COLLAB_STYLES.map((st) => {
            const isSelected = style === st;
            return (
              <button
                key={st}
                onClick={() => onUpdate({ style: st })}
                className={clsx(
                  "p-2.5 rounded-lg border text-left text-xs font-medium transition-all select-none",
                  isSelected
                    ? "bg-rose-500/20 text-rose-200 border-rose-500/50"
                    : "bg-[#11141B] text-slate-300 border-[#1E2530] hover:border-slate-700"
                )}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Intent Pitch */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Active Intent (What are you actively looking for right now?)
          </label>
        </div>
        <textarea
          rows={2}
          value={activeIntent}
          onChange={(e) => onUpdate({ activeIntent: e.target.value })}
          className="w-full bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 leading-relaxed"
          placeholder="e.g. Building an autonomous medical triage agent for HackHealth 2026. Need a strong React/Figma UI developer."
        />
      </div>
    </div>
  );
}
