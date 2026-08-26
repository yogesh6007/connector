import React, { useState } from "react";
import { Search, Sparkles, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IntentSearchBarProps {
  query: string;
  onSearch: (q: string) => void;
}

const PRESET_INTENTS = [
  "I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week.",
  "Looking for a Rust systems engineer to deploy models to low-power edge hardware",
  "Need a clinical biomedical data specialist to validate trauma trial datasets",
  "Looking for a Three.js / WebGL developer for real-time 3D data visualization",
];

export function IntentSearchBar({ query, onSearch }: IntentSearchBarProps) {
  const [inputVal, setInputVal] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0C0F16] border border-[#1C2330] p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
            Natural Language Teammate Intent Engine
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121622] text-slate-400 border border-[#1E2636]">
          Compatibility Formula (35/30/20/15)
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={2}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Describe what you are building, what complementary skills you lack, and required bandwidth..."
          className="w-full bg-[#111520] border border-[#1E2636] text-xs sm:text-sm text-slate-100 rounded-xl p-3.5 pr-28 focus:outline-none focus:border-amber-500 placeholder:text-slate-500 leading-relaxed font-sans"
        />
        <div className="absolute right-3 bottom-3">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Compute Matches
          </Button>
        </div>
      </form>

      {/* Fast Intent Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-mono uppercase text-slate-500">
          Try Sample Intent Queries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_INTENTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputVal(preset);
                onSearch(preset);
              }}
              className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-[#121622] hover:bg-[#181E2C] text-slate-300 border border-[#1C2434] hover:border-amber-500/40 transition-colors font-mono"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
