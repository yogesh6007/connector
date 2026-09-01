import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { OPPORTUNITY_TYPES, WORK_MODES } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Briefcase,
  Sparkles,
  Search,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Users2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const Opportunities = () => {
  const { opportunities, applyToOpportunity, joinOpportunityCommunity } = useApp();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOppForApply, setSelectedOppForApply] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredOpps = opportunities.filter(opp => {
    if (selectedType !== 'all' && opp.type !== selectedType) return false;
    if (selectedWorkMode !== 'all' && opp.workMode !== selectedWorkMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title?.toLowerCase().includes(q);
      const matchOrg = opp.orgName?.toLowerCase().includes(q);
      const matchDesc = opp.description?.toLowerCase().includes(q);
      const matchSkills = (opp.skillsRequired || []).some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchOrg && !matchDesc && !matchSkills) return false;
    }
    return true;
  });

  const handleOpenApply = (opp) => {
    setSelectedOppForApply(opp);
    setCoverNote(`Hi ${opp.orgName} team,\n\nI am enthusiastic about applying for the ${opp.title} opportunity. I have hands-on experience in ${(opp.skillsRequired || []).slice(0, 3).join(', ')}.`);
    setResumeUrl(user?.resumeUrl || '');
    setApplySuccess(false);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOppForApply) return;
    setIsApplying(true);

    try {
      await applyToOpportunity(selectedOppForApply.id, {
        coverNote,
        resumeUrl,
        matchScore: null
      });
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedOppForApply(null);
        setApplySuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Application error:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleJoinCommunity = async (oppId) => {
    try {
      await joinOpportunityCommunity(oppId);
    } catch (err) {
      console.error('Error joining community:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Opportunity + Community Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Career Opportunities & Hubs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply to verified internships and fellowships, and join the associated opportunity community hubs for announcements and discussions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organization, or skill..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Opportunity Types</option>
            {Object.values(OPPORTUNITY_TYPES).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Work Modes</option>
            {Object.values(WORK_MODES).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Listings Grid */}
      {filteredOpps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No opportunities published yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            As partner organizations publish open internships and fellowships, they will appear here with dedicated community discussion spaces.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOpps.map(opp => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <Avatar
                    src={opp.orgLogo}
                    name={opp.orgName}
                    size="lg"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                      <Badge variant="brand" size="xs">{opp.type}</Badge>
                    </div>

                    <p className="text-xs font-semibold text-brand-700">{opp.orgName}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.location} ({opp.workMode})
                      </span>
                      <span className="font-semibold text-emerald-700">{opp.stipend}</span>
                      {opp.communityMembersCount > 0 && (
                        <span className="flex items-center gap-1 text-purple-600 font-semibold">
                          <Users2 className="w-3.5 h-3.5" />
                          {opp.communityMembersCount} Community Members
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <Link to={`/student/opportunities/${opp.id}`}>
                    <Button variant="secondary" size="sm" icon={Users2}>
                      Community Hub
                    </Button>
                  </Link>

                  <Button
                    variant="ai"
                    size="sm"
                    onClick={() => handleOpenApply(opp)}
                    className="font-bold"
                  >
                    Apply
                  </Button>
                </div>

              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {opp.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {(opp.skillsRequired || []).map(skill => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {selectedOppForApply && (
        <Modal
          isOpen={!!selectedOppForApply}
          onClose={() => setSelectedOppForApply(null)}
          title={`Apply for ${selectedOppForApply.title}`}
          subtitle={selectedOppForApply.orgName}
        >
          {applySuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs text-slate-500">
                Your application has been received by {selectedOppForApply.orgName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Note / Why You're a Fit *</label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume / Portfolio URL</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedOppForApply(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isApplying}>
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};
