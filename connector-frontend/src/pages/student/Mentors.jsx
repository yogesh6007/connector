import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MentorCard from '../../components/cards/MentorCard';
import EmptyState from '../../components/common/EmptyState';
import {
  GraduationCap,
  Search,
  Award,
  Sparkles,
  Building
} from 'lucide-react';

export default function Mentors() {
  const { mentors } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');

  const allExpertise = Array.from(
    new Set(mentors.flatMap((m) => m.expertise || []))
  );

  const filteredMentors = mentors.filter((m) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      m.name?.toLowerCase().includes(term) ||
      m.position?.toLowerCase().includes(term) ||
      m.organization?.toLowerCase().includes(term) ||
      m.expertise?.some((e) => e.toLowerCase().includes(term));

    const matchesExpertise =
      selectedExpertise === 'All' || m.expertise?.includes(selectedExpertise);

    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-indigo-200">
            <Award className="w-4 h-4 text-purple-400" />
            <span>1-on-1 Mentorship & Career Guidance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Connect with World-Class Mentors
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Gain architectural guidance on student projects, get feedback on research papers, and prepare for high-impact tech careers with verified industry and academic mentors.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by mentor name, organization (e.g. DeepMind, Google Cloud), or domain..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Areas of Expertise</option>
              {allExpertise.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No mentors found matching your filters"
          description="Try selecting a different area of expertise or broadening your search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedExpertise('All');
          }}
        />
      )}
    </div>
  );
}
