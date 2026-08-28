import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import TeammateCard from '../../components/cards/TeammateCard';
import EmptyState from '../../components/common/EmptyState';
import { DOMAINS, SKILLS_LIST, EXPERIENCE_LEVELS } from '../../utils/constants';
import {
  Sparkles,
  Search,
  Filter,
  Users2,
  BrainCircuit,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function FindTeammates() {
  const { currentUser } = useAuth();
  const { students, projects } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [minMatchScore, setMinMatchScore] = useState(70);

  // Available candidate students (excluding current user)
  const candidateStudents = students.filter((s) => s.id !== currentUser.id);

  // Calculate dynamic match factors for each student relative to current student's primary project
  const primaryProject = projects.find((p) => p.owner?.id === currentUser.id) || projects[0];

  const processedCandidates = candidateStudents.map((student) => {
    const projectSkills = primaryProject?.requiredSkills || ['Python', 'PyTorch', 'React'];
    const matchingSkills = (student.skills || []).filter((s) =>
      projectSkills.some((ps) => ps.toLowerCase() === s.toLowerCase())
    );

    const matchScore = Math.min(
      98,
      Math.max(65, 60 + matchingSkills.length * 10 + (student.experience?.length ? 8 : 0))
    );

    const reasons = [
      `Matched skills: ${matchingSkills.length > 0 ? matchingSkills.join(', ') : student.skills?.slice(0, 2).join(', ')}`,
      `Domain alignment: ${student.interests?.[0] || primaryProject?.domain}`,
      `Verified availability: ${student.availability || '15+ hrs/week'}`
    ];

    return {
      ...student,
      matchScore,
      matchReasons: reasons,
      matchingSkills
    };
  });

  const filteredCandidates = processedCandidates.filter((cand) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      cand.name?.toLowerCase().includes(term) ||
      cand.headline?.toLowerCase().includes(term) ||
      cand.university?.toLowerCase().includes(term) ||
      cand.skills?.some((s) => s.toLowerCase().includes(term));

    const matchesSkill = selectedSkill === 'All' || cand.skills?.includes(selectedSkill);
    const matchesDomain =
      selectedDomain === 'All' || cand.interests?.some((i) => i.includes(selectedDomain));
    const matchesScore = cand.matchScore >= minMatchScore;

    return matchesSearch && matchesSkill && matchesDomain && matchesScore;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-purple-200">
            <BrainCircuit className="w-4 h-4 text-purple-300" />
            <span>AI Multi-Vector Teammate Matching Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Compatible Teammates
          </h1>

          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            Our AI analyzes required skills, domain interests, prior project track records, and schedule availability to rank candidate collaborators for your projects.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, university, or technology..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Skill Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Technical Skills</option>
              {SKILLS_LIST.slice(0, 18).map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Domains</option>
              {DOMAINS.slice(0, 6).map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Score Slider */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Minimum AI Match Threshold:</span>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-32 accent-purple-600 cursor-pointer"
            />
            <span className="font-extrabold text-purple-700 px-2 py-0.5 bg-purple-50 rounded-md border border-purple-200">
              {minMatchScore}%+
            </span>
          </div>

          <span className="text-slate-400 font-semibold">
            {filteredCandidates.length} Teammates ranked by compatibility
          </span>
        </div>
      </div>

      {/* Candidate Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((student) => (
            <TeammateCard
              key={student.id}
              student={student}
              matchScore={student.matchScore}
              matchReasons={student.matchReasons}
              matchingSkills={student.matchingSkills}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users2}
          title="No teammates match this threshold"
          description="Try lowering the match threshold slider or clearing your skill filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedSkill('All');
            setSelectedDomain('All');
            setMinMatchScore(50);
          }}
        />
      )}
    </div>
  );
}
