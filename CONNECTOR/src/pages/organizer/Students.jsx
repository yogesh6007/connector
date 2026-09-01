import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { POPULAR_SKILLS } from '../../utils/constants';
import {
  Users2,
  Search,
  Sparkles,
  GraduationCap,
  Award,
  MessageSquare,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Students = () => {
  const { students, startConversation } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');

  const filteredStudents = students.filter(student => {
    if (selectedSkill !== 'all') {
      const hasSkill = (student.skills || []).some(sk => 
        (typeof sk === 'string' ? sk : sk.name).toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!hasSkill) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name?.toLowerCase().includes(q);
      const matchCollege = student.college?.toLowerCase().includes(q);
      const matchHeadline = student.headline?.toLowerCase().includes(q);
      if (!matchName && !matchCollege && !matchHeadline) return false;
    }
    return true;
  });

  const handleMessageStudent = (student) => {
    const convId = startConversation({
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      role: student.headline
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Talent Discovery Radar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Discover Student Builders & Researchers</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Search across verified university engineers, designers, and researchers with proven open-source code and competition rankings.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, college, headline..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Primary Skills</option>
            {POPULAR_SKILLS.map(sk => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{student.name}</h3>
                    <p className="text-xs text-brand-700 font-semibold">{student.college}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{student.headline}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {student.bio}
              </p>

              {/* Skills */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Verified Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {(student.skills || []).map(skillObj => {
                    const skName = typeof skillObj === 'string' ? skillObj : skillObj.name;
                    return (
                      <span key={skName} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {skName}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link to={`/organizer/students/${student.id}`}>
                <Button variant="secondary" size="xs">
                  Full Portfolio Review
                </Button>
              </Link>

              <Button
                variant="ai"
                size="xs"
                icon={MessageSquare}
                onClick={() => handleMessageStudent(student)}
              >
                Reach Out / Interview
              </Button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
