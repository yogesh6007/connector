import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Code2, Globe, Heart } from 'lucide-react';
import { Button } from '../components/common/Button';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Public Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  CONNECTOR
                </span>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mt-0.5">
                  AI Collaboration Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="/#projects" className="hover:text-white transition-colors">Projects</a>
              <a href="/#ai-matching" className="hover:text-white transition-colors flex items-center gap-1.5 text-purple-300 hover:text-purple-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Matching</span>
              </a>
              <a href="/#opportunities" className="hover:text-white transition-colors">Opportunities</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ai" size="sm" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Outlet */}
      <div className="flex-1 pt-20">
        <Outlet />
      </div>

      {/* Modern Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-white">CONNECTOR</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The next-generation AI-powered platform uniting ambitious students, project teams, and forward-thinking organizations.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform</h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="/#ai-matching" className="hover:text-white transition-colors">AI Teammate Matcher</a></li>
                <li><a href="/#projects" className="hover:text-white transition-colors">Project Collaboration Hub</a></li>
                <li><a href="/#opportunities" className="hover:text-white transition-colors">Student Opportunities</a></li>
              </ul>
            </div>

            {/* Roles */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">For Builders</h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link to="/register" className="hover:text-white transition-colors">Join as Student</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Join as Organizer</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Quick Demo Sign In</Link></li>
                <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Trust & Community */}
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Ecosystem</h5>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Connecting 10,000+ top student developers, designers, and researchers across 120+ leading universities.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">● Live Platform:</span> Matching 500+ student teams weekly.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 CONNECTOR Inc. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built for visionary student builders & organizations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
