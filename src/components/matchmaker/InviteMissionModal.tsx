import React, { useState } from "react";
import { MatchRecommendation } from "@/types";
import { Button } from "@/components/ui/Button";
import { X, Send, Sparkles } from "lucide-react";

interface InviteMissionModalProps {
  match: MatchRecommendation | null;
  onClose: () => void;
  onConfirmInvite: (data: {
    candidateId: string;
    candidateName: string;
    projectTitle: string;
    role: string;
    message: string;
    hours: number;
  }) => void;
}

export function InviteMissionModal({
  match,
  onClose,
  onConfirmInvite,
}: InviteMissionModalProps) {
  if (!match) return null;

  const [projectTitle, setProjectTitle] = useState("NeuroTriage AI");
  const [role, setRole] = useState("Lead UI/UX & React Frontend Engineer");
  const [hours, setHours] = useState(match.availabilityOverlapHours || 10);
  const [message, setMessage] = useState(
    `Hey ${match.candidate.name.split(" ")[0]}, saw your background in ${match.candidate.skills.slice(0, 2).map((s) => s.name).join(" and ")}. We are building NeuroTriage AI for HackHealth 2026 and have our PyTorch inference pipeline running. We need your product design & frontend expertise to ship the demo before the deadline!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmInvite({
      candidateId: match.candidate.id,
      candidateName: match.candidate.name,
      projectTitle,
      role,
      message,
      hours,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0C0F16] border border-[#1E2738] rounded-2xl p-6 shadow-2xl shadow-black relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#1A2230] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={match.candidate.avatar}
              alt={match.candidate.name}
              className="w-11 h-11 rounded-xl object-cover border border-cyan-500/40"
            />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Dispatch Mission Collaboration Invite
              </span>
              <h2 className="text-base font-bold text-slate-100">
                Invite {match.candidate.name} to Team
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Project Mission Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-[#111520] border border-[#1E2636] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Estimated Bandwidth</label>
              <input
                type="number"
                min={2}
                max={30}
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full bg-[#111520] border border-[#1E2636] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Role in Project</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#111520] border border-[#1E2636] text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Personalized Collaboration Pitch
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#111520] border border-[#1E2636] text-xs text-slate-200 rounded-lg p-3 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
            />
          </div>

          {/* Compatibility Confirmation Pill with Breakdown */}
          <div className="p-3 rounded-xl bg-[#10141E] border border-[#1A212E] flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {match.compatibilityScore}% Synergy Bound
            </span>
            <span className="text-slate-400 text-[11px]">
              Comp {match.breakdown.complementarity}/35 • Sem {match.breakdown.semanticSimilarity}/30
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A212E]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="md"
              icon={<Send className="w-4 h-4" />}
            >
              Send Mission Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
