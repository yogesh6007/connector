import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Users2,
  Sparkles,
  Check,
  X,
  Plus,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const MyProjects = () => {
  const { user } = useAuth();
  const { projects, handleJoinRequest, startConversation } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('leading'); // 'leading' | 'joined'

  const ownedProjects = projects.filter(p => p.ownerId === user?.id);
  const joinedProjects = projects.filter(p => p.ownerId !== user?.id && (p.members || []).some(m => m.id === user?.id));

  const handleMessageApplicant = (studentId, studentName, studentAvatar) => {
    const convId = startConversation({
      id: studentId,
      name: studentName,
      avatar: studentAvatar,
      role: 'Project Applicant'
    });
    navigate('/student/messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FolderKanban className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Project Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Project Teams</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your project roster, open vacancies, and candidate join requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/projects/create">
            <Button variant="ai" size="md" icon={Plus}>
              Create New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('leading')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leading'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Projects I Lead ({ownedProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'joined'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Projects I Joined ({joinedProjects.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leading' ? (
        <div className="space-y-6">
          {ownedProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">You haven’t created any projects yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Have a project idea? Publish it to recruit passionate teammates from Stanford, MIT, Berkeley, and beyond!
              </p>
              <Link to="/student/projects/create">
                <Button variant="primary" size="sm" icon={Plus}>
                  Create First Project
                </Button>
              </Link>
            </div>
          ) : (
            ownedProjects.map(project => {
              const pendingRequests = (project.joinRequests || []).filter(r => r.status === 'Pending');
              const currentMembers = project.members || [];

              return (
                <div key={project.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200/60">
                          {project.domain}
                        </span>
                        <Badge variant="brand" size="xs">{project.status}</Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <p className="font-bold text-slate-900">{currentMembers.length} / {project.teamCapacity || 4} Members</p>
                        <p className="text-slate-400">{pendingRequests.length} pending requests</p>
                      </div>
                      <Link to={`/student/projects/${project.id}`}>
                        <Button variant="secondary" size="xs" icon={ExternalLink} iconPosition="right">
                          Public View
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    
                    {/* Pending Candidate Join Requests */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Candidate Join Applications ({pendingRequests.length})
                        </h4>
                      </div>

                      {pendingRequests.length === 0 ? (
                        <p className="text-xs text-slate-400 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                          No pending join requests right now. Teammate applications will appear here with AI compatibility scores.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {pendingRequests.map(req => (
                            <div
                              key={req.id}
                              className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/50 via-slate-50 to-brand-50/40 border border-purple-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-3">
                                <img
                                  src={req.studentAvatar}
                                  alt={req.studentName}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                                    <span className="text-[11px] text-slate-500">({req.studentCollege})</span>
                                  </div>
                                  <p className="text-[11px] font-semibold text-brand-700 mt-0.5">
                                    Applied for: {req.roleApplied}
                                  </p>
                                  {req.note && (
                                    <p className="text-xs text-slate-600 mt-1 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                                      "{req.note}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <Button
                                  variant="secondary"
                                  size="xs"
                                  icon={MessageSquare}
                                  onClick={() => handleMessageApplicant(req.studentId, req.studentName, req.studentAvatar)}
                                >
                                  Chat
                                </Button>
                                <Button
                                  variant="danger"
                                  size="xs"
                                  icon={X}
                                  onClick={() => handleJoinRequest(project.id, req.id, 'reject')}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="ai"
                                  size="xs"
                                  icon={Check}
                                  onClick={() => handleJoinRequest(project.id, req.id, 'accept')}
                                >
                                  Accept Member
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Team Members Roster */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Current Team Members ({currentMembers.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentMembers.map(member => (
                          <div key={member.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                              <p className="text-[11px] font-semibold text-brand-600 truncate">{member.role}</p>
                              <p className="text-[10px] text-slate-400 truncate">{member.college}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Joined Projects Tab */
        <div className="space-y-6">
          {joinedProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <Users2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">You haven't joined any project teams yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore open project vacancies and submit join requests with your skills!
              </p>
              <Link to="/student/projects">
                <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                  Browse Open Projects
                </Button>
              </Link>
            </div>
          ) : (
            joinedProjects.map(proj => (
              <div key={proj.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      {proj.domain}
                    </span>
                    <Badge variant="brand" size="xs">Active Member</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Lead: {proj.ownerName} ({proj.ownerCollege})</p>
                </div>

                <Link to={`/student/projects/${proj.id}`}>
                  <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                    Open Project
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
