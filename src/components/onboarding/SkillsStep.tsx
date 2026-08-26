import React, { useState } from "react";
import { SkillItem, ExperienceLevel } from "@/types";
import { Plus, X, Search, Check } from "lucide-react";
import { clsx } from "clsx";
import { Badge } from "@/components/ui/Badge";

const SUGGESTED_SKILLS: { name: string; category: SkillItem["category"] }[] = [
  { name: "PyTorch", category: "AI/ML" },
  { name: "Computer Vision", category: "AI/ML" },
  { name: "LangChain / RAG", category: "AI/ML" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Figma", category: "Design" },
  { name: "Design Systems", category: "Design" },
  { name: "Python / FastAPI", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "Rust", category: "Systems" },
  { name: "Go", category: "Backend" },
  { name: "Docker", category: "Systems" },
  { name: "WebRTC", category: "Systems" },
  { name: "Flutter", category: "Mobile" },
  { name: "Clinical Data Pipelines", category: "Domain" },
];

const LEVELS: ExperienceLevel[] = ["Beginner", "Intermediate", "Advanced", "Lead"];

interface SkillsStepProps {
  skills: SkillItem[];
  onUpdateSkills: (skills: SkillItem[]) => void;
}

export function SkillsStep({ skills, onUpdateSkills }: SkillsStepProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "AI/ML", "Frontend", "Design", "Backend", "Systems", "Domain"];

  const filteredSuggestions = SUGGESTED_SKILLS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    const notAlreadyAdded = !skills.some((sk) => sk.name === s.name);
    return matchesSearch && matchesCat && notAlreadyAdded;
  });

  const handleAddSkill = (name: string, category: SkillItem["category"], level: ExperienceLevel = "Intermediate") => {
    const newSkill: SkillItem = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      category,
      level,
    };
    onUpdateSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (id: string) => {
    onUpdateSkills(skills.filter((s) => s.id !== id));
  };

  const handleChangeLevel = (id: string, newLevel: ExperienceLevel) => {
    onUpdateSkills(
      skills.map((s) => (s.id === id ? { ...s, level: newLevel } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
          Step 02 / 04 • Capability Graph
        </span>
        <h2 className="text-xl font-bold text-slate-100 mt-1">
          Define your practical skill matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          NEXUS calculates team complementarity by matching what you bring with what missions lack.
        </p>
      </div>

      {/* Current Added Skills with Level Picker */}
      <div className="p-3.5 rounded-xl bg-[#11141B] border border-[#1E2530] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Selected Skills ({skills.length})
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Click level to change proficiency
          </span>
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center italic">
            No skills added yet. Select from the suggestions below or search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#161C27] border border-[#242D3C]"
              >
                <div className="truncate">
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={skill.level}
                    onChange={(e) => handleChangeLevel(skill.id, e.target.value as ExperienceLevel)}
                    className="bg-[#10141C] border border-[#2B3545] text-[11px] text-amber-300 font-mono rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search & Suggestions */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search or add custom skill (e.g. Next.js, PyTorch, Figma)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  handleAddSkill(search.trim(), "AI/ML");
                  setSearch("");
                }
              }}
              className="w-full bg-[#11141B] border border-[#1E2530] text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-[#11141B] text-slate-400 hover:text-slate-200 border border-[#1E2530]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {filteredSuggestions.map((s) => (
            <button
              key={s.name}
              onClick={() => handleAddSkill(s.name, s.category)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#141822] hover:bg-[#1C2332] text-slate-300 border border-[#202735] hover:border-cyan-500/40 transition-all text-left"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
