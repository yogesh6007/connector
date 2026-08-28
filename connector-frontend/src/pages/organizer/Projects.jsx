import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { DOMAINS } from '../../utils/constants';
import {
  FolderGit2,
  Search,
  Users,
  Clock,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  Send,
  ExternalLink
} from 'lucide-react';
import { getStatusBadgeColor } from '../../utils/helpers';

export default function OrganizerProjects() {
  const { projects, startConversation, addToast } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedProjectForSponsor, setSelectedProjectForSponsor] = useState(null);
  const [sponsorNote, setSponsorNote] = useState('');

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.requiredSkills?.some((s) => s.toLowerCase().includes(term));

    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const handleContactTeam = (proj) => {
    startConversation(proj.owner);
    navigate('/organizer/messages');
  };

  const handleSendSponsorship = (e) => {
    e.preventDefault();
    addToast(
      `Collaboration inquiry & mentorship offer sent to "${selectedProjectForSponsor?.title}"!`,
      'success'
    );
    setSelectedProjectForSponsor(null);
    setSponsorNote('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Projects Directory</h1>
        <p className="text-xs text-slate-500">
          Discover student capstones, hackathon winners, and early prototypes seeking corporate mentorship and sponsorship
        </p>
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
              placeholder="Search by project name, description, or technology (e.g. PyTorch, React)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium text-slate-700"
            >
              <option value="All">All Domains</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="primary">{proj.domain}</Badge>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(proj.status)}`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{proj.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {(proj.requiredSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Team meta */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  <Avatar src={proj.owner?.avatar} name={proj.owner?.name} size="sm" />
                  <div>
                    <p className="font-bold text-slate-900">{proj.owner?.name}</p>
                    <p className="text-[11px] text-slate-500">{proj.owner?.university} • {proj.currentTeamSize}/{proj.teamSize} Team Members</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  icon={MessageSquare}
                  onClick={() => handleContactTeam(proj)}
                >
                  Message Lead
                </Button>

                <Button
                  size="xs"
                  variant="gradient"
                  icon={HeartHandshake}
                  onClick={() => setSelectedProjectForSponsor(proj)}
                >
                  Offer Mentorship / Sponsorship
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No student projects found"
          description="Try clearing your search query or selecting a different technical domain."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedDomain('All');
          }}
        />
      )}

      {/* Offer Mentorship / Sponsor Modal */}
      {selectedProjectForSponsor && (
        <Modal
          isOpen={!!selectedProjectForSponsor}
          onClose={() => setSelectedProjectForSponsor(null)}
          title={`Support "${selectedProjectForSponsor.title}"`}
          subtitle="Propose mentorship, cloud compute grants, or corporate sponsorship for this student team."
        >
          <form onSubmit={handleSendSponsorship} className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 leading-relaxed">
              🤝 Connecting with student teams can involve technical reviews, grant awards, or direct recruitment pipelines.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Collaboration / Sponsorship Proposal *
              </label>
              <textarea
                rows={4}
                value={sponsorNote}
                onChange={(e) => setSponsorNote(e.target.value)}
                placeholder="Explain what resources you can provide (e.g. cloud compute credits, engineering mentorship, fast-track interview for team members)..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedProjectForSponsor(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
                Send Mentorship / Sponsorship Offer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
