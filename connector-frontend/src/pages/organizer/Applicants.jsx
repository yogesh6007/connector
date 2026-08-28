import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AiMatchBadge from '../../components/ai/AiMatchBadge';
import EmptyState from '../../components/common/EmptyState';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Sparkles,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { formatDate, getStatusBadgeColor } from '../../utils/helpers';

export default function Applicants() {
  const { applications, opportunities, updateApplicationStatus, startConversation } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOppId, setSelectedOppId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filteredApplicants = applications.filter((app) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      app.studentName?.toLowerCase().includes(term) ||
      app.opportunityTitle?.toLowerCase().includes(term) ||
      app.studentUniversity?.toLowerCase().includes(term) ||
      app.skills?.some((s) => s.toLowerCase().includes(term));

    const matchesOpp = selectedOppId === 'All' || app.opportunityId === selectedOppId;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

    return matchesSearch && matchesOpp && matchesStatus;
  });

  const handleMessage = (app) => {
    startConversation({
      id: app.studentId,
      name: app.studentName,
      avatar: app.studentAvatar,
      headline: app.studentHeadline
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applicant Management</h1>
        <p className="text-xs text-slate-500">
          Review candidates, inspect AI match evaluations, and manage the candidate selection pipeline
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name, university, or technology..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Filter by Opportunity */}
          <div className="sm:col-span-4">
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Opportunities</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option>Applied</option>
              <option>Under Review</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>{filteredApplicants.length} Candidates in filter</span>
          <span className="text-purple-600">AI Match Scores Ranked</span>
        </div>
      </div>

      {/* Applicants List */}
      {filteredApplicants.length > 0 ? (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-purple-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <Avatar src={app.studentAvatar} name={app.studentName} size="lg" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                      <AiMatchBadge score={app.matchScore || 90} size="xs" />
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{app.studentHeadline}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {app.studentUniversity}
                      </span>
                      <span>•</span>
                      <span>Applied for <strong>{app.opportunityTitle}</strong></span>
                      <span>•</span>
                      <span>{formatDate(app.appliedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-start">
                  <Button
                    size="xs"
                    variant="outline"
                    icon={MessageSquare}
                    onClick={() => handleMessage(app)}
                  >
                    Chat
                  </Button>

                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setSelectedApplicant(app)}
                  >
                    View Dossier
                  </Button>

                  {app.status === 'Applied' && (
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                    >
                      Mark Under Review
                    </Button>
                  )}

                  {['Applied', 'Under Review'].includes(app.status) && (
                    <Button
                      size="xs"
                      variant="gradient"
                      onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                    >
                      Shortlist Candidate
                    </Button>
                  )}

                  {app.status === 'Shortlisted' && (
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => updateApplicationStatus(app.id, 'Interview')}
                    >
                      Schedule Interview
                    </Button>
                  )}

                  {['Shortlisted', 'Interview'].includes(app.status) && (
                    <Button
                      size="xs"
                      variant="success"
                      onClick={() => updateApplicationStatus(app.id, 'Accepted')}
                    >
                      Accept
                    </Button>
                  )}

                  {app.status !== 'Rejected' && app.status !== 'Accepted' && (
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>

              {/* Motivation Snippet */}
              {app.statement && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 italic">
                  "{app.statement}"
                </div>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(app.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No applicants found matching these filters"
          description="Try selecting a different opportunity or clearing search filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedOppId('All');
            setSelectedStatus('All');
          }}
        />
      )}

      {/* Full Applicant Dossier Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title={`Candidate Dossier: ${selectedApplicant.studentName}`}
          subtitle={`Application for ${selectedApplicant.opportunityTitle}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3">
                <Avatar src={selectedApplicant.studentAvatar} name={selectedApplicant.studentName} size="md" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedApplicant.studentName}</h3>
                  <p className="text-xs text-slate-600">{selectedApplicant.studentUniversity}</p>
                </div>
              </div>
              <AiMatchBadge score={selectedApplicant.matchScore || 92} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Statement of Motivation & Project Portfolio
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedApplicant.statement}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Technical Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(selectedApplicant.skills || []).map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedApplicant.resumeUrl && (
              <div className="pt-2">
                <a
                  href={selectedApplicant.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Candidate Resume / Portfolio</span>
                </a>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedApplicant(null)}>
                Close
              </Button>
              <Button
                variant="gradient"
                icon={MessageSquare}
                onClick={() => {
                  const target = selectedApplicant;
                  setSelectedApplicant(null);
                  handleMessage(target);
                }}
              >
                Start Direct Message
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
