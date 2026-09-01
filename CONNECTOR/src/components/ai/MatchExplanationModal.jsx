import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Sparkles, CheckCircle2, Award, BookOpen, Layers, Zap } from 'lucide-react';

export const MatchExplanationModal = ({
  isOpen,
  onClose,
  targetName = 'Candidate',
  matchData = {},
  onConnect
}) => {
  const { matchScore, matchTier = 'Moderate', matchedSkills = [], reasons = [] } = matchData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Match Intelligence Report"
      subtitle={`Compatibility breakdown for ${targetName}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Score Header Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 via-purple-50 to-indigo-50/60 border border-purple-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-600 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                {matchTier} Compatibility
              </span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mt-1">
              {matchScore}% Overall Match
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Evaluated across 4 multi-factor semantic embeddings.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-purple-100 flex flex-col items-center justify-center text-purple-700">
            <span className="text-xl font-black">{matchScore}%</span>
            <span className="text-[10px] font-semibold text-slate-400">Score</span>
          </div>
        </div>

        {/* Breakdown factors */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Why this match?
          </h5>
          <div className="space-y-2.5">
            {reasons.length > 0 ? (
              reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>High overlap across core project technologies and domain interests.</span>
              </div>
            )}
          </div>
        </div>

        {/* Direct Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Direct Verified Skill Matches
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map(skill => (
                <Badge key={skill} variant="brand" size="sm" icon={Zap}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Pillars */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">Skill Graph (45%)</p>
              <p className="text-[10px] text-slate-500">Mastery & Endorsements</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">Track Record (25%)</p>
              <p className="text-[10px] text-slate-500">Projects & Experience</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">Domain Match (20%)</p>
              <p className="text-[10px] text-slate-500">Sub-field Semantic Alignment</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">Availability (10%)</p>
              <p className="text-[10px] text-slate-500">Work Mode & Bandwidth</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          {onConnect && (
            <Button
              variant="ai"
              size="sm"
              icon={Sparkles}
              onClick={() => {
                onClose();
                onConnect();
              }}
            >
              Connect with {targetName.split(' ')[0]}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
