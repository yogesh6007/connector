import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { opportunityService } from '../../services/opportunityService';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Briefcase,
  Users2,
  Bell,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Building2,
  FileCheck2,
  Share2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const OpportunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { applyToOpportunity, joinOpportunityCommunity, startConversation } = useApp();
  const navigate = useNavigate();

  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState('overview'); // overview, announcements, discussion, members

  // Post Announcement Modal (Organizer only)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

  // Discussion Input
  const [discussionText, setDiscussionText] = useState('');
  const [isSendingDiscussion, setIsSendingDiscussion] = useState(false);

  // Apply Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const fetchHubData = async () => {
    try {
      const data = await opportunityService.getCommunity(id);
      setCommunityData(data);
    } catch (e) {
      console.error('Error loading community hub:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, [id]);

  const opp = communityData?.opportunity;
  const isOrganizer = opp?.orgId === user?.id || communityData?.isOrganizer;
  const isMember = communityData?.isMember;

  const handleJoin = async () => {
    try {
      await joinOpportunityCommunity(id);
      await fetchHubData();
    } catch (e) {
      console.error('Error joining:', e);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementContent.trim()) return;
    setIsPostingAnnouncement(true);

    try {
      await opportunityService.postAnnouncement(id, {
        title: announcementTitle,
        content: announcementContent
      });
      setIsAnnouncementModalOpen(false);
      setAnnouncementTitle('');
      setAnnouncementContent('');
      await fetchHubData();
    } catch (e) {
      console.error('Error creating announcement:', e);
    } finally {
      setIsPostingAnnouncement(false);
    }
  };

  const handleSendDiscussion = async (e) => {
    e.preventDefault();
    if (!discussionText.trim() || isSendingDiscussion) return;
    setIsSendingDiscussion(true);

    try {
      await opportunityService.postDiscussion(id, {
        content: discussionText.trim()
      });
      setDiscussionText('');
      await fetchHubData();
    } catch (e) {
      console.error('Error posting discussion:', e);
    } finally {
      setIsSendingDiscussion(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      await applyToOpportunity(id, {
        coverNote,
        resumeUrl,
        matchScore: null
      });
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
      }, 1500);
    } catch (e) {
      console.error('Application failed:', e);
    } finally {
      setIsApplying(false);
    }
  };

  const handleMessageUser = (person) => {
    startConversation({
      id: person.id,
      name: person.name,
      avatar: person.avatar || person.logo,
      role: `Member of ${opp?.title} Community`
    });
    navigate(user?.role === 'organizer' ? '/organizer/messages' : '/student/messages');
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading Opportunity Community Hub...
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Opportunity Not Found</h3>
        <Link to="/student/opportunities">
          <Button variant="secondary" size="sm">Back to Opportunities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb */}
      <Link to="/student/opportunities" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Opportunities</span>
      </Link>

      {/* Main Hub Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar src={opp.orgLogo} name={opp.orgName} size="xl" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{opp.title}</h1>
                <Badge variant="brand" size="sm">{opp.type}</Badge>
              </div>
              <p className="text-xs font-bold text-brand-700">{opp.orgName} • Community Hub</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {opp.location} ({opp.workMode})
                </span>
                <span className="font-bold text-emerald-700">{opp.stipend}</span>
                <span className="flex items-center gap-1 font-semibold text-purple-700">
                  <Users2 className="w-3.5 h-3.5" />
                  {communityData?.members?.length || 1} Community Members
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            {!isOrganizer && !isMember && (
              <Button variant="secondary" size="md" icon={Users2} onClick={handleJoin}>
                Join Community
              </Button>
            )}

            {!isOrganizer && (
              <Button variant="ai" size="md" icon={FileCheck2} onClick={() => setIsApplyModalOpen(true)} className="font-bold">
                Apply Now
              </Button>
            )}

            {isOrganizer && (
              <Button variant="ai" size="md" icon={Plus} onClick={() => setIsAnnouncementModalOpen(true)} className="font-bold">
                Post Announcement
              </Button>
            )}
          </div>
        </div>

      </div>

      {/* Community Space Navigation & Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Channels Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-2 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-card h-fit">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-2">
            Community Channels
          </p>

          <button
            onClick={() => setActiveChannel('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              activeChannel === 'overview' ? 'bg-brand-50 text-brand-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-4 h-4 text-brand-600" />
            <span># overview-and-roles</span>
          </button>

          <button
            onClick={() => setActiveChannel('announcements')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              activeChannel === 'announcements' ? 'bg-brand-50 text-brand-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-600" />
              <span># announcements</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
              {communityData?.announcements?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveChannel('discussion')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              activeChannel === 'discussion' ? 'bg-brand-50 text-brand-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span># discussion-q-and-a</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
              {communityData?.discussions?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveChannel('members')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              activeChannel === 'members' ? 'bg-brand-50 text-brand-700 shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users2 className="w-4 h-4 text-emerald-600" />
              <span># community-members</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {communityData?.members?.length || 0}
            </span>
          </button>
        </div>

        {/* Right Channel Content Viewport (9 Cols) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
          
          {/* View 1: Overview */}
          {activeChannel === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview & Description</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {opp.description}
                </p>
              </div>

              {opp.responsibilities && opp.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Core Responsibilities</h3>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {opp.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-brand-600 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(opp.skillsRequired || []).map(skill => (
                    <span key={skill} className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View 2: Announcements */}
          {activeChannel === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Official Organization Announcements ({communityData?.announcements?.length || 0})
                </h3>

                {isOrganizer && (
                  <Button variant="ai" size="xs" icon={Plus} onClick={() => setIsAnnouncementModalOpen(true)}>
                    Post Update
                  </Button>
                )}
              </div>

              {(communityData?.announcements || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No announcements posted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {(communityData?.announcements || []).map(ann => (
                    <div key={ann.id} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar src={ann.senderAvatar} name={ann.senderName} size="sm" />
                          <span className="text-xs font-bold text-slate-900">{ann.senderName} ({ann.senderRole})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(ann.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{ann.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View 3: Discussion Forum */}
          {activeChannel === 'discussion' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Community Discussion & Q&A
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-100">
                {(communityData?.discussions || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No discussion messages yet. Ask questions about the opportunity or share thoughts below!
                  </p>
                ) : (
                  (communityData?.discussions || []).map(msg => (
                    <div key={msg.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar src={msg.senderAvatar} name={msg.senderName} size="xs" />
                          <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(msg.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pl-7">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendDiscussion} className="flex gap-2">
                <input
                  type="text"
                  value={discussionText}
                  onChange={(e) => setDiscussionText(e.target.value)}
                  placeholder="Ask a question or start a discussion..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" variant="primary" size="sm" disabled={isSendingDiscussion || !discussionText.trim()} icon={Send}>
                  Send
                </Button>
              </form>
            </div>
          )}

          {/* View 4: Members */}
          {activeChannel === 'members' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Community Members ({communityData?.members?.length || 0})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(communityData?.members || []).map(member => (
                  <div key={member.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={member.avatar || member.logo} name={member.name} size="md" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{member.college || member.organizationName || member.headline}</p>
                      </div>
                    </div>

                    {member.id !== user?.id && (
                      <Button variant="secondary" size="xs" icon={MessageSquare} onClick={() => handleMessageUser(member)}>
                        Chat
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Post Announcement Modal (Organizer only) */}
      {isAnnouncementModalOpen && (
        <Modal
          isOpen={isAnnouncementModalOpen}
          onClose={() => setIsAnnouncementModalOpen(false)}
          title="Post Official Announcement"
          subtitle={`To all ${opp.title} community members`}
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Title *</label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Application Deadline Extended, Info Session Schedule"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Content / Announcement Details *</label>
              <textarea
                rows={4}
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Write update details here..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" type="button" onClick={() => setIsAnnouncementModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={isPostingAnnouncement} icon={Send}>
                {isPostingAnnouncement ? 'Publishing...' : 'Publish Announcement'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for ${opp.title}`}
          subtitle={opp.orgName}
        >
          {applySuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs text-slate-500">
                Your application has been received by {opp.orgName}.
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
                  placeholder="Describe your background and why you are interested in this position..."
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
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsApplyModalOpen(false)}>
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
