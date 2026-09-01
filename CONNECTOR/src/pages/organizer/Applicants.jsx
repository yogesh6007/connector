import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import {
  FileCheck2,
  Users2,
  Sparkles,
  Search,
  Check,
  X,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AIMatchScoreBadge } from '../../components/ai/AIMatchScoreBadge';

export const Applicants = () => {
  const { user } = useAuth();
  const { applications, updateApplicationStatus, startConversation } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);

  const filteredApplicants = applications.filter(app => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName?.toLowerCase().includes(q);
      const matchCollege = app.studentCollege?.toLowerCase().includes(q);
      const matchRole = app.opportunityTitle?.toLowerCase().includes(q);
      if (!matchName && !matchCollege && !matchRole) return false;
    }
    return true;
  });

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
  };

  const handleDirectChat = (app) => {
    const convId = startConversation({
      id: app.studentId,
      name: app.studentName,
      avatar: app.studentAvatar,
      role: app.studentDegree || 'Student Applicant'
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Users2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Candidate Recruitment CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Applicant Pipeline</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review student applicants, evaluate AI compatibility scores, and move candidates through recruitment stages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <span>Total Candidates: {applications.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, college, role..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Stages ({applications.length})</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            No applicants found matching your query.
          </div>
        ) : (
          filteredApplicants.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-elevated transition-all"
            >
              {/* Left Candidate Details */}
              <div className="flex items-start gap-4">
                <img
                  src={app.studentAvatar}
                  alt={app.studentName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                    <span className="text-xs text-slate-500">• {app.studentCollege}</span>
                    {app.matchScore && <AIMatchScoreBadge score={app.matchScore} size="sm" />}
                  </div>

                  <p className="text-xs font-semibold text-brand-700">
                    Applying for: {app.opportunityTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span>{app.studentDegree}</span>
                    {app.studentGpa && <span>GPA: {app.studentGpa}</span>}
                    <span>Applied {formatRelativeTime(app.appliedDate)}</span>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                      "{app.coverNote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status Workflow Controls */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Stage:</span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlist</option>
                    <option value="Interview">Interview</option>
                    <option value="Accepted">Accept Candidate</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                    >
                      <span>Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <Button
                    variant="primary"
                    size="sm"
                    icon={MessageSquare}
                    onClick={() => handleDirectChat(app)}
                  >
                    Message
                  </Button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
