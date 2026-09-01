import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';
import { projectService } from '../../services/projectService';
import {
  FolderKanban,
  Users2,
  Sparkles,
  Code2,
  Globe,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  Bookmark,
  Share2,
  ArrowLeft,
  Briefcase,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { startConversation, sendProjectInterest, handleInterestRequest } = useApp();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, team, requests, discussion

  // Interests state for owner
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(false);

  // Discussions state for team members
  const [discussions, setDiscussions] = useState([]);
  const [discussionInput, setDiscussionInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // "I'm Interested" modal
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [interestMsg, setInterestMsg] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [interestError, setInterestError] = useState('');

  const fetchProjectDetails = async () => {
    try {
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const isOwner = project?.ownerId === user?.id;
  const isMember = (project?.members || []).some(m => m.id === user?.id);
  const memberCount = (project?.members || []).length;
  const maxCap = project?.teamCapacity || 4;
  const isFull = memberCount >= maxCap;

  // Load interest requests if owner
  useEffect(() => {
    if (isOwner && project?.id) {
      const fetchInterests = async () => {
        setLoadingInterests(true);
        try {
          const reqs = await projectService.getProjectInterests(project.id);
          setInterests(reqs);
        } catch (e) {
          console.error('Error fetching interests:', e);
        } finally {
          setLoadingInterests(false);
        }
      };
      fetchInterests();
    }
  }, [isOwner, project?.id]);

  // Load team discussions if member
  useEffect(() => {
    if (isMember && project?.id) {
      const fetchDiscussions = async () => {
        try {
          const msgs = await projectService.getProjectDiscussions(project.id);
          setDiscussions(msgs);
        } catch (e) {
          console.error('Error fetching discussions:', e);
        }
      };
      fetchDiscussions();
    }
  }, [isMember, project?.id]);

  const handleOpenInterest = () => {
    setInterestError('');
    setInterestSuccess(false);
    const suggestedRole = Array.isArray(project.requiredRoles) && project.requiredRoles.length > 0
      ? (typeof project.requiredRoles[0] === 'string' ? project.requiredRoles[0] : project.requiredRoles[0].role)
      : 'Collaborator';
    setRoleApplied(suggestedRole);
    setInterestMsg(`Hi ${project.ownerName}, I would love to contribute to ${project.title} as ${suggestedRole}.`);
    setIsInterestModalOpen(true);
  };

  const handleSendInterest = async (e) => {
    e.preventDefault();
    setInterestError('');
    try {
      await sendProjectInterest(project.id, {
        message: interestMsg,
        roleApplied
      });
      setInterestSuccess(true);
      setTimeout(() => {
        setIsInterestModalOpen(false);
        setInterestSuccess(false);
      }, 1500);
    } catch (err) {
      setInterestError(err.message || 'Failed to submit interest.');
    }
  };

  const handleActionRequest = async (interestId, action) => {
    try {
      await handleInterestRequest(project.id, interestId, action);
      await fetchProjectDetails();
      const updatedReqs = await projectService.getProjectInterests(project.id);
      setInterests(updatedReqs);
    } catch (err) {
      console.error('Error handling request:', err);
    }
  };

  const handleSendDiscussion = async (e) => {
    e.preventDefault();
    if (!discussionInput.trim() || isSendingMsg) return;
    setIsSendingMsg(true);

    try {
      const newMsg = await projectService.sendProjectDiscussion(project.id, discussionInput.trim());
      setDiscussions(prev => [...prev, newMsg]);
      setDiscussionInput('');
    } catch (err) {
      console.error('Error sending discussion msg:', err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleMessageUser = (person) => {
    startConversation({
      id: person.id || person.studentId,
      name: person.name || person.studentName,
      avatar: person.avatar || person.studentAvatar,
      role: `Project Collaborator (${project.title})`
    });
    navigate('/student/messages');
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
        <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Project Not Found</h3>
        <Link to="/student/projects">
          <Button variant="secondary" size="sm">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Back button */}
      <Link to="/student/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Main Project Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                {project.domain}
              </span>
              <Badge variant={project.status === 'Recruiting' ? 'success' : 'brand'} size="sm">
                {isFull ? 'Team Full' : project.status}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {project.title}
            </h1>

            <p className="text-xs text-slate-500 font-semibold">
              Leader: <Link to={`/student/profile/${project.ownerId}`} className="text-brand-600 hover:underline">{project.ownerName}</Link>
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {project.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2.5 shrink-0">
            {!isOwner && !isMember && (
              <Button
                variant="ai"
                size="md"
                disabled={isFull || project.status !== 'Recruiting'}
                onClick={handleOpenInterest}
                icon={UserPlus}
                className="font-bold shadow-md"
              >
                {isFull ? 'Team Full' : project.status !== 'Recruiting' ? 'Recruitment Closed' : "I'm Interested"}
              </Button>
            )}

            {!isOwner && (
              <Button
                variant="secondary"
                size="sm"
                icon={MessageSquare}
                onClick={() => handleMessageUser({ id: project.ownerId, name: project.ownerName, avatar: project.ownerAvatar })}
              >
                Message Leader
              </Button>
            )}

            {isOwner && (
              <Badge variant="brand" size="md">You are Project Leader</Badge>
            )}

            {isMember && !isOwner && (
              <Badge variant="success" size="md">You are a Team Member</Badge>
            )}
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Team Size</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">{memberCount} / {maxCap} Members</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Work Mode</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">{project.workMode}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">{project.duration}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Posted</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">{formatRelativeTime(project.createdAt)}</p>
          </div>
        </div>

        {/* Links */}
        {(project.githubUrl || project.demoUrl) && (
          <div className="flex items-center gap-4 pt-2 text-xs">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600 font-semibold">
                <Code2 className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-semibold">
                <Globe className="w-4 h-4" />
                <span>Live Preview / Demo</span>
              </a>
            )}
          </div>
        )}

      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview & Roles
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'team' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Team Roster</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{memberCount}</span>
        </button>

        {isOwner && (
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Teammate Requests</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">
              {interests.filter(i => i.status === 'pending').length}
            </span>
          </button>
        )}

        {isMember && (
          <button
            onClick={() => setActiveTab('discussion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'discussion' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Team Discussion
          </button>
        )}
      </div>

      {/* Tab 1: Overview & Roles */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Required Skills */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {(project.requiredSkills || []).map(skill => (
                <span key={skill} className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Required Roles */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Open Team Roles</h3>
            <div className="space-y-2">
              {(project.requiredRoles || []).map((r, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{typeof r === 'string' ? r : r.role}</span>
                  <Badge variant="brand" size="xs">Open Vacancy</Badge>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Team Roster */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Team Members ({memberCount})</h3>
            <span className="text-xs font-semibold text-slate-500">{memberCount} of {maxCap} Capacity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(project.members || []).map(member => (
              <div key={member.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={member.avatar}
                    name={member.name}
                    size="md"
                  />
                  <div className="min-w-0">
                    <Link to={`/student/profile/${member.id}`} className="hover:underline hover:text-brand-600 transition-colors">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                    </Link>
                    <p className="text-[11px] text-brand-700 font-semibold truncate">{member.role}</p>
                    {member.college && <p className="text-[10px] text-slate-400 truncate">{member.college}</p>}
                  </div>
                </div>

                {member.id !== user?.id && (
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={MessageSquare}
                    onClick={() => handleMessageUser(member)}
                  >
                    Chat
                  </Button>
                )}
              </div>
            ))}
          </div>

          {memberCount === 1 && isOwner && (
            <p className="text-xs text-slate-400 pt-2 text-center">
              You're currently the only member. Share your project to find teammates!
            </p>
          )}
        </div>
      )}

      {/* Tab 3: Teammate Join Requests (Owner only) */}
      {activeTab === 'requests' && isOwner && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Applicant Interest Requests ({interests.length})
          </h3>

          {loadingInterests ? (
            <p className="text-xs text-slate-400">Loading requests...</p>
          ) : interests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No teammate requests received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {interests.map(req => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar src={req.studentAvatar} name={req.studentName} size="sm" />
                      <div>
                        <Link to={`/student/profile/${req.studentId}`} className="hover:underline hover:text-brand-600 transition-colors">
                          <h4 className="text-xs font-bold text-slate-900">{req.studentName}</h4>
                        </Link>
                        <p className="text-[10px] text-slate-500">{req.studentCollege || 'Student'} • {formatRelativeTime(req.createdAt)}</p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-brand-700 mt-1">Role: {req.roleApplied}</p>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleMessageUser({ id: req.studentId, name: req.studentName, avatar: req.studentAvatar })}
                    >
                      Message
                    </Button>

                    {req.status === 'pending' ? (
                      <>
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => handleActionRequest(req.id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleActionRequest(req.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Badge variant={req.status === 'accepted' ? 'success' : 'danger'} size="sm">
                        {req.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Team Discussion Forum */}
      {activeTab === 'discussion' && isMember && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Team Workspace Discussion
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-100">
            {discussions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No messages in team discussion yet. Start collaborating below!</p>
            ) : (
              discussions.map(msg => (
                <div key={msg.id} className="p-3 rounded-xl bg-white border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{msg.senderName} ({msg.senderRole})</span>
                    <span className="text-[10px] text-slate-400">{formatRelativeTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-700">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendDiscussion} className="flex gap-2">
            <input
              type="text"
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
              placeholder="Send message to project team..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
            <Button type="submit" variant="primary" size="sm" disabled={isSendingMsg || !discussionInput.trim()} icon={Send}>
              Send
            </Button>
          </form>
        </div>
      )}

      {/* "I'm Interested" Modal */}
      {isInterestModalOpen && (
        <Modal
          isOpen={isInterestModalOpen}
          onClose={() => setIsInterestModalOpen(false)}
          title={`Join ${project.title}`}
          subtitle={`Submit interest to ${project.ownerName}`}
        >
          {interestSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interest Sent!</h3>
              <p className="text-xs text-slate-500">
                The project leader has been notified of your interest.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInterest} className="space-y-4">
              {interestError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {interestError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role You Are Applying For</label>
                <input
                  type="text"
                  value={roleApplied}
                  onChange={(e) => setRoleApplied(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Why are you interested in this project? How can you contribute? *
                </label>
                <textarea
                  rows={4}
                  value={interestMsg}
                  onChange={(e) => setInterestMsg(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsInterestModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={Send}>
                  Send Interest
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};
