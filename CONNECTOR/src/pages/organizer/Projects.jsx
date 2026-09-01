import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PROJECT_DOMAINS } from '../../utils/constants';
import {
  FolderKanban,
  Sparkles,
  Search,
  Users2,
  MessageSquare,
  Award,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OrganizerProjects = () => {
  const { projects, startConversation } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const filteredProjects = projects.filter(p => {
    if (selectedDomain !== 'all' && p.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const handleContactTeam = (proj) => {
    const convId = startConversation({
      id: proj.ownerId,
      name: proj.ownerName,
      avatar: proj.ownerAvatar,
      role: `Project Lead (${proj.title})`
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Student Innovation Radar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Student Innovation Projects</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Discover high-impact prototypes built by university teams. Sponsor or recruit entire top-performing engineering cohorts.
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
              placeholder="Search projects by title, domain..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Domains</option>
            {PROJECT_DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                  {proj.domain}
                </span>
                <Badge variant="brand" size="xs">{proj.status}</Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {proj.tagline || proj.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {(proj.requiredSkills || []).map(sk => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Team: {proj.members?.length || 1}/{proj.teamCapacity || 4}</span>
                <span>Lead: <strong>{proj.ownerName}</strong> ({proj.ownerCollege})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link to={`/student/projects/${proj.id}`}>
                <Button variant="secondary" size="xs" icon={ExternalLink} iconPosition="right">
                  View Prototype
                </Button>
              </Link>

              <Button
                variant="ai"
                size="xs"
                icon={MessageSquare}
                onClick={() => handleContactTeam(proj)}
              >
                Contact Team / Sponsor
              </Button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
