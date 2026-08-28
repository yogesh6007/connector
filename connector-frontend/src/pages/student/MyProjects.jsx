import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import AiMatchBadge from '../../components/ai/AiMatchBadge';
import {
  FolderGit2,
  PlusCircle,
  Users,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { formatDate, getStatusBadgeColor } from '../../utils/helpers';

export default function MyProjects() {
  const { currentUser } = useAuth();
  const { projects, handleJoinRequest, removeMember, startConversation } = useApp();

  const myProjects = projects.filter((p) => p.owner?.id === currentUser.id);
  const [selectedProjectId, setSelectedProjectId] = useState(myProjects[0]?.id || '');

  const activeProject = myProjects.find((p) => p.id === selectedProjectId) || myProjects[0];

  const handleMessageApplicant = (student) => {
    startConversation({
      id: student.studentId,
      name: student.studentName,
      avatar: student.studentAvatar,
      headline: student.studentHeadline
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Projects & Teams</h1>
          <p className="text-xs text-slate-500">
            Manage your project workspaces, review applicant join requests, and coordinate team members
          </p>
        </div>

        <Link to="/student/projects/create">
          <Button variant="gradient" size="sm" icon={PlusCircle}>
            Create New Project
          </Button>
        </Link>
      </div>

      {myProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Project Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Owned Projects ({myProjects.length})
            </h2>

            <div className="space-y-2.5">
              {myProjects.map((p) => {
                const isSelected = activeProject?.id === p.id;
                const pendingCount = (p.joinRequests || []).filter((r) => r.status === 'pending').length;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeColor(p.status)}`}>
                        {p.status}
                      </span>
                      {pendingCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                          {pendingCount} Request{pendingCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">{p.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {p.currentTeamSize} / {p.teamSize} Team Members • {p.domain}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Project Management Dossier */}
          {activeProject && (
            <div className="lg:col-span-8 space-y-6">
              {/* Project Header Info */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary">{activeProject.domain}</Badge>
                      <Badge variant="default">{activeProject.workMode}</Badge>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeProject.title}</h2>
                  </div>

                  <Link to={`/student/projects/${activeProject.id}`}>
                    <Button variant="outline" size="xs">
                      Public View
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{activeProject.description}</p>

                {/* Team Capacity Progress */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Team Capacity: {activeProject.currentTeamSize} of {activeProject.teamSize} members</span>
                    <span className="text-indigo-600 font-bold">
                      {Math.round((activeProject.currentTeamSize / activeProject.teamSize) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (activeProject.currentTeamSize / activeProject.teamSize) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pending Join Requests Section */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Pending Teammate Requests ({(activeProject.joinRequests || []).filter((r) => r.status === 'pending').length})
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {(activeProject.joinRequests || []).filter((r) => r.status === 'pending').length > 0 ? (
                    (activeProject.joinRequests || [])
                      .filter((r) => r.status === 'pending')
                      .map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <Avatar src={req.studentAvatar} name={req.studentName} size="md" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900">{req.studentName}</h4>
                                  <AiMatchBadge score={req.matchScore || 92} size="xs" />
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{req.studentHeadline}</p>
                                <span className="text-[10px] text-slate-400">
                                  Applied for role: <strong className="text-indigo-600">{req.appliedRole}</strong> • {formatDate(req.date)}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-start">
                              <Button
                                size="xs"
                                variant="outline"
                                icon={MessageSquare}
                                onClick={() => handleMessageApplicant(req)}
                              >
                                Chat
                              </Button>
                              <Button
                                size="xs"
                                variant="danger"
                                icon={X}
                                onClick={() => handleJoinRequest(activeProject.id, req.id, 'reject')}
                              >
                                Decline
                              </Button>
                              <Button
                                size="xs"
                                variant="success"
                                icon={Check}
                                onClick={() => handleJoinRequest(activeProject.id, req.id, 'accept')}
                              >
                                Accept Teammate
                              </Button>
                            </div>
                          </div>

                          {/* Message from applicant */}
                          <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
                            "{req.message}"
                          </div>

                          {/* Skills preview */}
                          {req.skills && req.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {req.skills.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No pending join requests for this project right now.
                    </div>
                  )}
                </div>
              </div>

              {/* Current Team Members Roster */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Active Team Members ({activeProject.members?.length || 1})
                </h3>

                <div className="space-y-2.5">
                  {(activeProject.members || []).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar src={m.avatar} name={m.name} size="md" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.name}</p>
                          <p className="text-[11px] text-slate-500">{m.role}</p>
                        </div>
                      </div>

                      {m.id === activeProject.owner?.id ? (
                        <Badge variant="primary" size="xs">Project Lead (You)</Badge>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeMember(activeProject.id, m.id)}
                          className="text-xs font-bold text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="You haven't created any projects yet"
          description="Have a great idea for an AI tool, web app, or hardware prototype? Create your first project to start finding teammates!"
          actionLabel="Create First Project"
          onAction={() => window.location.assign('/student/projects/create')}
        />
      )}
    </div>
  );
}
