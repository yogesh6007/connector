import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { clsx } from "clsx";

const DOMAINS = [
  "Healthcare AI",
  "Autonomous Agents",
  "Clinical NLP",
  "Design Systems",
  "Edge Computing",
  "Decentralized Systems",
  "Bioinformatics",
  "Accessibility & A11y",
  "Computer Vision",
  "FinTech & Fraud Detection",
  "Open Hardware",
  "Compiler Engineering",
  "Spatial Computing (3D)",
  "EdTech & Micro-learning",
  "Climate & Earth Observation",
];

interface InterestsStepProps {
  interests: string[];
  onUpdateInterests: (interests: string[]) => void;
}

export function InterestsStep({ interests, onUpdateInterests }: InterestsStepProps) {
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (domain: string) => {
    if (interests.includes(domain)) {
      onUpdateInterests(interests.filter((i) => i !== domain));
    } else {
      onUpdateInterests([...interests, domain]);
    }
  };

  const addCustom = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      onUpdateInterests([...interests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Step 03 / 04 • Domain Affinity
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1">
          Select domain clusters & technical frontiers
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Interests form the contextual connective tissue between you and problem spaces worth solving.
        </p>
      </div>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#11141B] border border-[#1E2530] min-h-[50px]">
        {interests.length === 0 ? (
          <span className="text-xs text-slate-500 italic">
            Select at least 2 domains below...
          </span>
        ) : (
          interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {interest}
              <button
                onClick={() => toggleInterest(interest)}
                className="hover:text-rose-300 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Custom Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add custom domain (e.g. Brain-Computer Interfaces)..."
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addCustom();
          }}
          className="flex-1 bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
        />
        <button
          onClick={addCustom}
          className="px-3 py-2 rounded-lg bg-[#161C27] hover:bg-[#1E2535] text-xs text-slate-300 border border-slate-700 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Suggested Domain Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-52 overflow-y-auto pr-1">
        {DOMAINS.map((domain) => {
          const isSelected = interests.includes(domain);
          return (
            <button
              key={domain}
              onClick={() => toggleInterest(domain)}
              className={clsx(
                "p-2.5 rounded-lg border text-left text-xs font-medium transition-all select-none",
                isSelected
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-sm shadow-emerald-950/30"
                  : "bg-[#11141B] text-slate-300 border-[#1E2530] hover:border-slate-700 hover:bg-[#141822]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{domain}</span>
                {isSelected && <span className="text-[10px] text-emerald-400 font-mono">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
