import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { PROJECT_DOMAINS, POPULAR_SKILLS, WORK_MODES } from '../../utils/constants';
import {
  FolderKanban,
  Sparkles,
  Plus,
  Trash2,
  Cpu,
  Layers,
  Users2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Code2,
  Globe
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const CreateProject = () => {
  const { user } = useAuth();
  const { createProject } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & ML');
  const [workMode, setWorkMode] = useState('Remote');
  const [duration, setDuration] = useState('3 Months');
  const [teamCapacity, setTeamCapacity] = useState(4);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  // Skills
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'React']);
  const [skillInput, setSkillInput] = useState('');

  // Vacancies
  const [vacancies, setVacancies] = useState([
    {
      id: `vac-${Date.now()}-1`,
      role: 'Frontend UI/UX Engineer',
      description: 'Design and build responsive user dashboards and telemetry visualizers.',
      skills: ['React', 'Tailwind CSS', 'UI/UX Design'],
      openings: 1
    }
  ]);

  // AI Analyzer State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const handleTriggerAIAnalysis = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeProject(description, title);
      setAiAnalysisResult(result);
      if (result.domain) setDomain(result.domain);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAISuggestions = () => {
    if (!aiAnalysisResult) return;
    
    // Merge extracted skills
    const combinedSkills = Array.from(new Set([...requiredSkills, ...aiAnalysisResult.extractedSkills]));
    setRequiredSkills(combinedSkills);

    // Apply suggested roles as vacancies
    if (aiAnalysisResult.suggestedRoles && aiAnalysisResult.suggestedRoles.length > 0) {
      const newVacancies = aiAnalysisResult.suggestedRoles.map((r, i) => ({
        id: `vac-${Date.now()}-${i}`,
        role: r.role,
        description: r.description,
        skills: r.skills || ['Python', 'React'],
        openings: 1
      }));
      setVacancies(newVacancies);
    }
  };

  const handleAddSkill = (s) => {
    if (!s || requiredSkills.includes(s)) return;
    setRequiredSkills(prev => [...prev, s]);
    setSkillInput('');
  };

  const handleRemoveSkill = (s) => {
    setRequiredSkills(prev => prev.filter(x => x !== s));
  };

  const handleAddVacancy = () => {
    setVacancies(prev => [
      ...prev,
      {
        id: `vac-${Date.now()}`,
        role: 'Full-Stack Engineer',
        description: 'Collaborate on APIs and client integration.',
        skills: ['React', 'Node.js'],
        openings: 1
      }
    ]);
  };

  const handleUpdateVacancy = (id, field, value) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleRemoveVacancy = (id) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProj = createProject({
      title: title.trim(),
      tagline: tagline.trim() || description.slice(0, 140),
      description: description.trim(),
      domain,
      workMode,
      duration,
      teamCapacity: parseInt(teamCapacity) || 4,
      requiredSkills,
      vacancies,
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      aiInsights: aiAnalysisResult ? {
        complexity: aiAnalysisResult.complexity,
        suggestedTeamSize: aiAnalysisResult.suggestedTeamSize,
        domainCategory: aiAnalysisResult.domain,
        keyTechnologies: aiAnalysisResult.extractedSkills,
        readinessScore: aiAnalysisResult.readinessScore,
        summary: aiAnalysisResult.summary
      } : {
        complexity: 'Intermediate',
        suggestedTeamSize: `${teamCapacity} members`,
        domainCategory: domain,
        keyTechnologies: requiredSkills,
        readinessScore: 85,
        summary: `Self-defined project within ${domain}.`
      }
    });

    navigate(`/student/projects/${newProj.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Interactive AI Project Architect</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Create a Collaborative Project</h1>
        <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl">
          Describe your idea. Our AI Project Analyzer will extract necessary tech stacks, recommend team structure, and instantly match you with ideal student collaborators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form (8 Cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
            
            {/* Title & Tagline */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">1. Project Overview</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI-Based Traffic Congestion Management"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One-sentence hook (e.g. Real-time urban traffic optimization using edge vision)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Detailed Description *</label>
                  <button
                    type="button"
                    onClick={handleTriggerAIAnalysis}
                    disabled={isAnalyzing || !description.trim()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'AI Analyze Project'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your vision, what problems you're solving, system architecture, tech stack, and what type of teammates you need..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Domain & Work Mode Specs */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900">2. Configuration & Scope</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Classification</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    {PROJECT_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months, Spring 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Target Team Size</label>
                  <select
                    value={teamCapacity}
                    onChange={(e) => setTeamCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                    <option value="5">5 Members</option>
                    <option value="6">6 Members</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repo Link (Optional)</label>
                  <div className="relative">
                    <Code2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Demo / Preview Link (Optional)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://project-demo.vercel.app"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-base font-bold text-slate-900">3. Required Technical Skills</h3>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {requiredSkills.map(sk => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-medium"
                  >
                    {sk}
                    <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-brand-400 hover:text-brand-900">
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(skillInput.trim());
                    }
                  }}
                  placeholder="Type skill and press Add (e.g. PyTorch, Next.js)"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddSkill(skillInput.trim())}
                  icon={Plus}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {POPULAR_SKILLS.slice(0, 8).map(sk => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleAddSkill(sk)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Vacancies */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">4. Open Role Vacancies</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={handleAddVacancy}
                  icon={Plus}
                >
                  Add Vacancy
                </Button>
              </div>

              <div className="space-y-3">
                {vacancies.map((vac, index) => (
                  <div key={vac.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Role #{index + 1}</span>
                      {vacancies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVacancy(vac.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={vac.role}
                          onChange={(e) => handleUpdateVacancy(vac.id, 'role', e.target.value)}
                          placeholder="e.g. ML Inference Engineer"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Open Positions</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={vac.openings}
                          onChange={(e) => handleUpdateVacancy(vac.id, 'openings', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Responsibilities & Requirements</label>
                      <input
                        type="text"
                        value={vac.description}
                        onChange={(e) => handleUpdateVacancy(vac.id, 'description', e.target.value)}
                        placeholder="Brief summary of what this teammate will build..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link to="/student/projects">
                <Button variant="secondary" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="ai"
                size="md"
                className="font-bold shadow-lg"
                icon={Sparkles}
                iconPosition="right"
              >
                Publish Project & Match Teammates
              </Button>
            </div>

          </form>
        </div>

        {/* AI Project Analyzer Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 shadow-xl border border-purple-500/30 space-y-5 sticky top-20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Project Analyzer</h3>
                <p className="text-[11px] text-purple-200/70">NLP scope & team extractor</p>
              </div>
            </div>

            {aiAnalysisResult ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Readiness Score:</span>
                    <span className="font-bold text-emerald-400">{aiAnalysisResult.readinessScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Inferred Domain:</span>
                    <span className="font-bold text-white truncate">{aiAnalysisResult.domain}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Complexity Tier:</span>
                    <span className="font-bold text-white">{aiAnalysisResult.complexity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300">Ideal Team:</span>
                    <span className="font-bold text-white">{aiAnalysisResult.suggestedTeamSize}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    Extracted Skills ({aiAnalysisResult.extractedSkills.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {aiAnalysisResult.extractedSkills.map(sk => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {aiAnalysisResult.suggestedRoles && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                      Suggested Roles ({aiAnalysisResult.suggestedRoles.length}):
                    </p>
                    <div className="space-y-1.5">
                      {aiAnalysisResult.suggestedRoles.map((r, i) => (
                        <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                          <p className="font-bold text-white">{r.role}</p>
                          <p className="text-slate-400 text-[10px] truncate">{r.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ai"
                  size="sm"
                  onClick={handleApplyAISuggestions}
                  className="w-full text-xs font-bold"
                  icon={CheckCircle2}
                >
                  Auto-Fill Skills & Roles
                </Button>
              </div>
            ) : (
              <div className="space-y-3 py-2 text-center">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your project description and click <strong>AI Analyze Project</strong> to automatically generate required skills and suggested roles.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleTriggerAIAnalysis}
                  disabled={isAnalyzing || !description.trim()}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs font-bold"
                  icon={Sparkles}
                >
                  {isAnalyzing ? 'Analyzing Text...' : 'Run AI Analysis'}
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
