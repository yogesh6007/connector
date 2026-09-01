import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Users2,
  FolderKanban,
  Briefcase,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  TrendingUp,
  Search,
  Code2,
  Globe
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { aiService } from '../../services/aiService';

export const Landing = () => {
  // Live Interactive AI Analyzer Playground
  const [demoTitle, setDemoTitle] = useState('Real-Time Multimodal Health Copilot');
  const [demoDesc, setDemoDesc] = useState(
    'Developing an edge-accelerated computer vision and speech recognition copilot for clinical diagnostics. Requires PyTorch, React Native, and FastAPI with zero-latency inference.'
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunSimulator = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeProject(demoTitle, demoDesc);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Simulator error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glowing Background Radial */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-gradient-to-tr from-brand-600/20 via-purple-600/20 to-pink-600/10 blur-[100px] pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-brand-400 text-xs font-bold shadow-lg backdrop-blur-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Next-Generation AI Collaboration Platform</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Build Real Projects.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
              Find Ideal Teammates.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            CONNECTOR unites ambitious student builders, breakthrough collaborative projects, and forward-thinking organizations on a single real-data platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button variant="ai" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto font-bold shadow-xl shadow-brand-500/20">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700">
              Sign In to Account
            </Button>
          </Link>
        </div>

        {/* Value Prop Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">AI Teammate Engine</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Multidisciplinary skill extraction and candidate scoring.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Project Workspaces</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Role vacancies, team rosters, and join request pipelines.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Direct Opportunities</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Internships, fellowships, and research grants with stage tracking.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Users2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Professional Connections</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">Establish permanent relationships and message student builders.</p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE AI PROJECT ANALYZER SIMULATOR */}
      <section id="ai-matching" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Interactive Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Test the AI Project Analyzer
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Type any project description below to see real-time skill extraction, role breakdown, and complexity sizing.
              </p>
            </div>

            <Button
              variant="ai"
              size="md"
              onClick={handleRunSimulator}
              disabled={isAnalyzing}
              icon={Sparkles}
              iconPosition="right"
              className="shrink-0 font-bold"
            >
              {isAnalyzing ? 'Analyzing Text...' : 'Analyze Project'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Side (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Title</label>
                <input
                  type="text"
                  value={demoTitle}
                  onChange={(e) => setDemoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Description & Tech Stack</label>
                <textarea
                  rows={4}
                  value={demoDesc}
                  onChange={(e) => setDemoDesc(e.target.value)}
                  className="w-full p-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* AI Output Side (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              {analysisResult ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-purple-300">{analysisResult.domain}</span>
                    <Badge variant="brand" size="xs">{analysisResult.complexity} Tier</Badge>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Extracted Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {analysisResult.extractedSkills.map(sk => (
                        <span key={sk} className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/30">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Suggested Roles:</span>
                    <div className="space-y-1.5 mt-1.5">
                      {analysisResult.suggestedRoles.map(r => (
                        <div key={r.role} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                          <p className="font-bold text-white">{r.role}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
                  <Cpu className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Click <strong>"Analyze Project"</strong> to run live heuristic extraction.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            How CONNECTOR Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A frictionless journey from registering your profile to collaborating on impactful products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <span className="text-2xl font-black text-brand-400">01</span>
            <h3 className="text-base font-bold text-white">Create Real Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register as a student or organizer, add your verified skills, experience, and interests.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <span className="text-2xl font-black text-purple-400">02</span>
            <h3 className="text-base font-bold text-white">Launch or Discover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a collaborative project with open vacancies, or browse active student initiatives.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <span className="text-2xl font-black text-pink-400">03</span>
            <h3 className="text-base font-bold text-white">Form Your Team</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit join requests, review candidate compatibility, and approve team members into your roster.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <span className="text-2xl font-black text-emerald-400">04</span>
            <h3 className="text-base font-bold text-white">Get Hired & Sponsored</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organizations explore student projects, publish fellowships, and recruit top contributors.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl border border-brand-500/30 relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ready to collaborate on real projects?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200">
              Create your account today and connect with passionate builders worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link to="/register">
              <Button variant="ai" size="lg" className="w-full sm:w-auto font-bold shadow-lg" icon={ArrowRight} iconPosition="right">
                Register Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
