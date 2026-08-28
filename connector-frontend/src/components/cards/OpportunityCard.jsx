import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Users,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatDeadline } from '../../utils/helpers';

export default function OpportunityCard({ opportunity }) {
  const { currentUser, isStudent } = useAuth();
  const { savedOpportunityIds, toggleSaveOpportunity, applyToOpportunity, applications } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statement, setStatement] = useState('');
  const [resumeUrl, setResumeUrl] = useState(currentUser?.portfolio || 'https://alexkumar.dev/resume.pdf');

  const isSaved = savedOpportunityIds.includes(opportunity.id);
  const hasApplied = applications.some(
    (a) => a.opportunityId === opportunity.id && a.studentId === currentUser?.id
  );

  const handleApply = (e) => {
    e.preventDefault();
    applyToOpportunity(opportunity, {
      statement: statement.trim() || 'Excited to apply and contribute to this opportunity!',
      resumeUrl: resumeUrl.trim(),
      matchScore: 92
    });
    setIsApplyModalOpen(false);
    setStatement('');
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'Internship':
        return 'primary';
      case 'Scholarship / Grant':
        return 'ai';
      case 'Competition / Hackathon':
        return 'warning';
      case 'Job':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={opportunity.organization?.logo}
                name={opportunity.organization?.name}
                size="md"
              />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {opportunity.organization?.name}
                </span>
                <Link to={`/student/opportunities`}>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 leading-snug">
                    {opportunity.title}
                  </h3>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant={getTypeBadgeVariant(opportunity.type)}>
                {opportunity.type}
              </Badge>
              <button
                type="button"
                onClick={() => toggleSaveOpportunity(opportunity.id)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Saved' : 'Save opportunity'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {opportunity.description}
          </p>

          {/* Skills Required */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(opportunity.skills || []).slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {(opportunity.skills || []).length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                +{opportunity.skills.length - 4} more
              </span>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">{opportunity.location} ({opportunity.workMode})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{opportunity.stipend || 'Competitive'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Due {formatDeadline(opportunity.deadline)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.applicantsCount || 0} applicants</span>
          </div>

          <div className="flex items-center gap-2">
            {isStudent && (
              <Button
                variant={hasApplied ? 'secondary' : 'gradient'}
                size="sm"
                disabled={hasApplied}
                onClick={() => setIsApplyModalOpen(true)}
              >
                {hasApplied ? 'Applied ✓' : 'Apply Now'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to ${opportunity.title}`}
        subtitle={`Application submission to ${opportunity.organization?.name}`}
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-950">AI Qualification Match</p>
              <p className="text-[11px] text-indigo-700">Your profile matches required skills & university eligibility.</p>
            </div>
            <Badge variant="ai">92% Match</Badge>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Resume / CV Link *
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://yourportfolio.com/resume.pdf"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cover Statement / Motivation
            </label>
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Highlight your relevant experience, student projects, and why you are the ideal fit for this opportunity..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
