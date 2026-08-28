import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Users2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  BrainCircuit,
  Search,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Landing() {
  const [interactiveSkill, setInteractiveSkill] = useState('Computer Vision');

  const demoMatches = [
    {
      name: 'Rahul Sharma',
      role: 'Computer Vision Engineer',
      university: 'MIT',
      score: 96,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      reasons: ['Expertise in YOLOv10 & PyTorch', 'Matches 4 required project skills', 'Available 15 hrs/week']
    },
    {
      name: 'Priya Patel',
      role: 'Full-Stack & UI/UX Specialist',
      university: 'UC Berkeley',
      score: 91,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      reasons: ['Production React & Figma design', 'Hackathon 1st Place winner', 'Strong interest in AI interfaces']
    }
  ];

  return (
    <div className="w-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40">
        {/* Glowing backdrop orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>The AI-Powered Collaboration & Opportunity Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Find People. Build Teams.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Create Something Great.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            CONNECTOR bridges ambitious students and forward-thinking organizations. Form dream project teams with AI-driven teammate matching, discover career-defining opportunities, and connect with world-class mentors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="gradient" size="xl" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700">
                Explore Demo Profiles
              </Button>
            </Link>
          </div>

          {/* Live Metric Badges */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-white">94%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">AI Match Precision</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">1,200+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Active Projects</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">450+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Top Organizations</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">$3.5M+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Grants & Stipends</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="primary">Ecosystem Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How CONNECTOR Accelerates Your Journey
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A frictionless 5-step lifecycle from profile creation to team formation and organizational sponsorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Create Profile',
                desc: 'Build your portfolio showcasing skills, projects, and career ambitions.',
                icon: GraduationCap
              },
              {
                step: '02',
                title: 'Discover Ideas',
                desc: 'Browse innovative student capstones, hackathon projects, and tech ventures.',
                icon: FolderGit2
              },
              {
                step: '03',
                title: 'AI Matching',
                desc: 'Our multi-vector algorithm pairs projects with the ideal technical teammates.',
                icon: BrainCircuit
              },
              {
                step: '04',
                title: 'Collaborate',
                desc: 'Chat with project leaders, review join requests, and form balanced teams.',
                icon: Users2
              },
              {
                step: '05',
                title: 'Grow & Scale',
                desc: 'Get mentored by industry veterans and sponsored by leading organizations.',
                icon: TrendingUp
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative hover:border-indigo-500/50 transition-all group"
                >
                  <span className="text-3xl font-black text-slate-700 group-hover:text-indigo-400 transition">
                    {item.step}
                  </span>
                  <div className="my-4 w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI TEAMMATE MATCHING SPOTLIGHT */}
      <section id="ai-matching" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="ai">Flagship AI Engine</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Stop searching randomly.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Let AI find your ideal collaborators.
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike generic networks that rely on simple keyword filters, CONNECTOR evaluates project tech stacks, domain interests, student experience levels, and weekly availability to compute verifiable match scores with transparent explanations.
            </p>

            <div className="space-y-3">
              {[
                'Multi-vector cosine similarity on student skills & project needs',
                'Transparent breakdown explaining exactly why each teammate fits',
                'AI Project Analyzer that extracts suggested roles automatically',
                'Structured join request flow with leader review and discussion'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/register">
                <Button variant="gradient" size="lg" icon={Sparkles}>
                  Try AI Teammate Matching
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interactive Simulator Preview */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-white">Live AI Teammate Simulation</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Model Ready
              </span>
            </div>

            {/* Target Project Mini Bar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Target Project</p>
              <h4 className="text-sm font-bold text-white">AI-Based Intelligent Traffic Optimization</h4>
              <p className="text-xs text-slate-400 mt-1">Required: Python, PyTorch, OpenCV, React, FastAPI</p>
            </div>

            {/* Candidate Cards */}
            <div className="space-y-3">
              {demoMatches.map((cand, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{cand.name}</h4>
                        <p className="text-xs text-slate-400">{cand.role} • {cand.university}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                      {cand.score}% Match
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                    {cand.reasons.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT COLLABORATION SECTION */}
      <section id="collaboration" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="primary">Team Formation</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Have an Idea? Build Your Dream Team in Minutes.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Post your project requirements, specify open roles, manage applications, and connect GitHub repositories directly on CONNECTOR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Project Workspaces</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated project dossiers with team capacity meters, member roles, GitHub repositories, and live demo links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Review & Accept Workflow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No unwanted team members. Project leaders review applicants, chat, inspect portfolios, and explicitly accept teammates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Showcase & Attract Sponsors</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publish completed projects to attract corporate sponsorship, venture funding, and full-time hiring interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES & MENTORSHIP */}
      <section id="opportunities" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Opportunities card */}
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <Badge variant="success">Career & Grants</Badge>
            <h3 className="text-2xl font-extrabold text-white">
              Discover High-Impact Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore curated internships, equity-free research grants, fellowship programs, and hackathons published directly by verified tech organizations.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Nexa AI Frontier Fellowship</h4>
                  <p className="text-[11px] text-slate-400">$25k Grant + $50k Cloud Credits</p>
                </div>
                <Badge variant="ai">Open</Badge>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Google Cloud Distributed Systems Intern</h4>
                  <p className="text-[11px] text-slate-400">Summer 2026 Cohort</p>
                </div>
                <Badge variant="primary">Internship</Badge>
              </div>
            </div>
          </div>

          {/* Mentorship card */}
          <div id="mentorship" className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <Badge variant="secondary">Direct Mentorship</Badge>
            <h3 className="text-2xl font-extrabold text-white">
              Connect with Seasoned Tech Mentors
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Book 1-on-1 advisory sessions with principal research scientists, engineering directors, and venture partners to refine your project architecture and career path.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120" alt="Mentor" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">Dr. Sarah Lin</h4>
                  <p className="text-[11px] text-slate-400">Principal AI Scientist @ Nexa AI</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">2 Slots Open</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120" alt="Mentor" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">David Chen</h4>
                  <p className="text-[11px] text-slate-400">Director of Cloud Engineering @ Google</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">3 Slots Open</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-indigo-950/60 via-slate-950 to-slate-950 border-t border-slate-800 text-center relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Build Your Next Big Thing?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of passionate student builders, top research mentors, and leading organizations on CONNECTOR.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gradient" size="xl" icon={ArrowRight} iconPosition="right">
                Join CONNECTOR Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="xl" className="bg-slate-800 text-white border-slate-700">
                Log In to Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 CONNECTOR. AI-Powered Professional Networking & Project Collaboration Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
