import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { aiService } from '../../services/aiService';
import { Sparkles, CheckCircle2, ArrowRight, BrainCircuit, Users, Layers, Tag } from 'lucide-react';

export default function AiProjectAnalyzerModal({
  isOpen,
  onClose,
  initialTitle = '',
  initialDescription = '',
  onApplyAnalysis
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleRunAnalysis = async () => {
    if (!description.trim() && !title.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await aiService.analyzeProject(title, description);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (analysisResult && onApplyAnalysis) {
      onApplyAnalysis(analysisResult);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Project Analyzer"
      subtitle="Paste your project idea or description to extract required skills, suggested roles, complexity, and optimal team size."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Input Form */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Project Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI Traffic Optimization & Congestion Predictor"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Project Description & Objectives *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you are building, the technologies you want to use, the problem it solves, and the kind of team you need..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleRunAnalysis}
            loading={analyzing}
            disabled={!description.trim() && !title.trim()}
            variant="gradient"
            icon={Sparkles}
          >
            {analyzing ? 'Analyzing with Neural Engine...' : 'Run AI Analysis'}
          </Button>
        </div>

        {/* Analysis Results Display */}
        {analysisResult && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-b from-indigo-50/50 to-purple-50/30 border border-indigo-100/80 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-indigo-950">AI Synthesis & Recommendations</h4>
              </div>
              <Badge variant="ai">AI Verified</Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">{analysisResult.summary}</p>

            {/* Grid of Extracted Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-indigo-100/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Domain</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{analysisResult.domain}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Team Composition</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{analysisResult.suggestedTeamSize} Members ({analysisResult.complexity})</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Duration</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{analysisResult.estimatedDuration}</p>
              </div>
            </div>

            {/* Extracted Skills */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Extracted Required Skills ({analysisResult.extractedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100/80 text-indigo-800 border border-indigo-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Roles */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Suggested Open Functional Roles:</p>
              <div className="space-y-2">
                {analysisResult.suggestedRoles.map((role, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{role.title}</span>
                      <div className="flex gap-1">
                        {role.skills.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Action */}
            <div className="pt-3 border-t border-indigo-100 flex justify-end">
              <Button onClick={handleApply} variant="gradient" icon={ArrowRight} iconPosition="right">
                Apply AI Suggestions to Form
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
