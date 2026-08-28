import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import AiMatchBadge from '../../components/ai/AiMatchBadge';
import { SKILLS_LIST, DOMAINS } from '../../utils/constants';
import {
  GraduationCap,
  Search,
  Filter,
  MapPin,
  Sparkles,
  MessageSquare,
  ExternalLink,
  Users
} from 'lucide-react';

export default function OrganizerStudents() {
  const { students, startConversation } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.headline?.toLowerCase().includes(term) ||
      s.university?.toLowerCase().includes(term) ||
      s.skills?.some((sk) => sk.toLowerCase().includes(term));

    const matchesSkill = selectedSkill === 'All' || s.skills?.includes(selectedSkill);
    const matchesDomain =
      selectedDomain === 'All' || s.interests?.some((i) => i.includes(selectedDomain));

    return matchesSearch && matchesSkill && matchesDomain;
  });

  const handleReachout = (student) => {
    startConversation(student);
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Student Talent</h1>
        <p className="text-xs text-slate-500">
          Source top engineering and AI talent across universities with verified project portfolios
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, university, or technology (e.g. PyTorch, React)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium text-slate-700"
            >
              <option value="All">All Technical Skills</option>
              {SKILLS_LIST.slice(0, 15).map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium text-slate-700"
            >
              <option value="All">All Domains</option>
              {DOMAINS.slice(0, 6).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>{filteredStudents.length} Students found</span>
          <span className="text-purple-600">AI Talent Match Ready</span>
        </div>
      </div>

      {/* Talent Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={student.avatar} name={student.name} size="lg" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{student.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{student.headline}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-indigo-600">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{student.university} ({student.gradYear || '2026'})</span>
                      </div>
                    </div>
                  </div>

                  <AiMatchBadge score={student.id === 'student-2' ? 96 : 91} size="xs" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {student.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {(student.skills || []).slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to={`/organizer/students/${student.id}`}>
                  <Button size="xs" variant="outline">
                    View Portfolio
                  </Button>
                </Link>

                <Button
                  size="xs"
                  variant="gradient"
                  icon={MessageSquare}
                  onClick={() => handleReachout(student)}
                >
                  Reach Out
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No students match this query"
          description="Try broadening your skill or domain filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedSkill('All');
            setSelectedDomain('All');
          }}
        />
      )}
    </div>
  );
}
