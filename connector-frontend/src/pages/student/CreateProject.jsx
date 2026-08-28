import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import SkillTagInput from '../../components/common/SkillTagInput';
import AiProjectAnalyzerModal from '../../components/ai/AiProjectAnalyzerModal';
import { DOMAINS, WORK_MODES, PROJECT_STATUSES } from '../../utils/constants';
import {
  Sparkles,
  FolderGit2,
  Globe,
  Users,
  Clock,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  BrainCircuit
} from 'lucide-react';
import { GithubIcon } from '../../components/common/BrandIcons';

export default function CreateProject() {
  const { currentUser } = useAuth();
  const { createProject, addToast } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & ML');
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'PyTorch']);
  const [teamSize, setTeamSize] = useState(4);
  const [duration, setDuration] = useState('3 Months');
  const [workMode, setWorkMode] = useState('Remote');
  const [complexity, setComplexity] = useState('Intermediate');
  const [lookingForTeammates, setLookingForTeammates] = useState(true);
  const [githubLink, setGithubLink] = useState('');
  const [demoLink, setDemoLink] = useState('');

  // Open roles
  const [openPositions, setOpenPositions] = useState([
    {
      id: `pos-${Date.now()}-1`,
      title: 'ML / AI Research Engineer',
      skills: ['Python', 'PyTorch'],
      description: 'Develop model architecture and fine-tune inference weights.'
    },
    {
      id: `pos-${Date.now()}-2`,
      title: 'Frontend React Developer',
      skills: ['React', 'TypeScript'],
      description: 'Build interactive user dashboard and telemetry views.'
    }
  ]);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleApplyAiAnalysis = (analysis) => {
    if (analysis.domain) setDomain(analysis.domain);
    if (analysis.extractedSkills && analysis.extractedSkills.length > 0) {
      setRequiredSkills(analysis.extractedSkills);
    }
    if (analysis.suggestedTeamSize) setTeamSize(analysis.suggestedTeamSize);
    if (analysis.estimatedDuration) setDuration(analysis.estimatedDuration);
    if (analysis.complexity) setComplexity(analysis.complexity);
    if (analysis.suggestedRoles && analysis.suggestedRoles.length > 0) {
      setOpenPositions(
        analysis.suggestedRoles.map((r, i) => ({
          id: `pos-ai-${Date.now()}-${i}`,
          title: r.title,
          skills: r.skills || [],
          description: r.description || ''
        }))
      );
    }
    addToast('AI recommendations applied to your project draft!', 'success');
  };

  const handleAddPosition = () => {
    setOpenPositions([
      ...openPositions,
      {
        id: `pos-${Date.now()}`,
        title: '',
        skills: [],
        description: ''
      }
    ]);
  };

  const handleRemovePosition = (id) => {
    setOpenPositions(openPositions.filter((p) => p.id !== id));
  };

  const handlePositionChange = (id, field, value) => {
    setOpenPositions(
      openPositions.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Please provide both a project title and description', 'error');
      return;
    }

    const newProject = createProject({
      title: title.trim(),
      description: description.trim(),
      domain,
      requiredSkills,
      teamSize: Number(teamSize),
      duration,
      workMode,
      complexity,
      lookingForTeammates,
      githubLink: githubLink.trim(),
      demoLink: demoLink.trim(),
      openPositions: openPositions.filter((p) => p.title.trim())
    });

    navigate(`/student/projects/${newProject.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Collaboration Project</h1>
          <p className="text-xs text-slate-500">
            Publish your project idea, define technical roles, and let our AI match you with capable student teammates
          </p>
        </div>

        {/* AI Analyzer Trigger Button */}
        <Button
          variant="gradient"
          size="sm"
          icon={BrainCircuit}
          onClick={() => setIsAiModalOpen(true)}
        >
          AI Project Analyzer
        </Button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Basic Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            Project Overview
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI-Based Intelligent Traffic Optimization & Congestion Predictor"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description & Problem Statement *
              </label>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Analyze with AI</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem you are solving, technical architecture, goals, and why you need collaborators..."
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Domain / Field
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              >
                {WORK_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills Required */}
          <SkillTagInput
            selectedSkills={requiredSkills}
            onChange={setRequiredSkills}
            label="Required Technologies & Skills"
            placeholder="Add technology stack (e.g. Python, PyTorch, React, Docker)..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Desired Team Size
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Months, 1 Semester"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Complexity Rating
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Open Roles & Teammate Positions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Open Technical Roles
              </h2>
              <p className="text-xs text-slate-500">Specify what roles you are recruiting for</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="xs"
              icon={Plus}
              onClick={handleAddPosition}
            >
              Add Role
            </Button>
          </div>

          <div className="space-y-3">
            {openPositions.map((pos, idx) => (
              <div key={pos.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600">Role #{idx + 1}</span>
                  {openPositions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePosition(pos.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={pos.title}
                    onChange={(e) => handlePositionChange(pos.id, 'title', e.target.value)}
                    placeholder="Role Title (e.g. Computer Vision Engineer)"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg outline-none font-semibold"
                    required
                  />
                  <input
                    type="text"
                    value={pos.description}
                    onChange={(e) => handlePositionChange(pos.id, 'description', e.target.value)}
                    placeholder="Short responsibility summary..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Links & Repository */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GithubIcon className="w-5 h-5 text-slate-800" />
            Project Links & Repositories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Live Demo / Pitch Deck (Optional)
              </label>
              <input
                type="url"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                placeholder="https://myproject-demo.vercel.app"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={() => navigate('/student/projects')}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" size="lg" icon={ArrowRight} iconPosition="right">
            Publish Project & Find Teammates
          </Button>
        </div>
      </form>

      {/* AI Project Analyzer Modal */}
      <AiProjectAnalyzerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialTitle={title}
        initialDescription={description}
        onApplyAnalysis={handleApplyAiAnalysis}
      />
    </div>
  );
}
