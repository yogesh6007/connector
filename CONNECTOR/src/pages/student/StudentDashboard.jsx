import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  FolderKanban,
  Users2,
  Briefcase,
  GraduationCap,
  Bell,
  ArrowRight,
  Plus,
  Compass,
  FileCheck2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { projects, myProjects, students, opportunities, applications, notifications } = useApp();

  const myApplications = applications.filter(a => a.studentId === user?.id);
  const openProjects = projects.filter(p => p.ownerId !== user?.id).slice(0, 2);
  const otherStudents = students.filter(s => s.id !== user?.id).slice(0, 3);
  const recentOpps = opportunities.slice(0, 2);
  const recentNotifs = notifications.slice(0, 3);

  // Dynamic Profile Completion
  const calculateProfileCompletion = () => {
    let score = 0;
    if (user?.name) score += 10;
    if (user?.headline) score += 15;
    if (user?.bio) score += 15;
    if (user?.college || user?.degree) score += 15;
    if (user?.avatar) score += 10;
    if (user?.skills && user.skills.length > 0) score += 15;
    if (user?.experience && user.experience.length > 0) score += 10;
    if (user?.github || user?.linkedin || user?.portfolio || user?.resumeUrl) score += 10;
    return Math.min(100, score);
  };

  const profilePower = calculateProfileCompletion();

  return (
    <div className="space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Innovation Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Builder'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl leading-relaxed">
            You have <strong className="text-white font-bold">{myProjects.length} active projects</strong> and <strong className="text-white font-bold">{myApplications.length} active applications</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link to="/student/projects/create">
            <Button variant="ai" size="md" icon={Plus} className="font-bold shadow-lg">
              Create Project
            </Button>
          </Link>
          <Link to="/student/teammates">
            <Button variant="secondary" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Find Teammates
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">My Projects</span>
            <FolderKanban className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myProjects.length}</p>
          <p className="text-[11px] text-brand-600 font-semibold">Active Collaborations</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myApplications.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Tracked Pipelines</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Network</span>
            <Users2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{user?.followers?.length || 0}</p>
          <p className="text-[11px] text-purple-600 font-semibold">Followers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Strength</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{profilePower}%</p>
          <p className="text-[11px] text-amber-700 font-semibold">AI Match Readiness</p>
        </div>
      </div>

      {/* Main Grid: Left 8 Cols, Right 4 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Recommended Teammates */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Builders</h3>
                  <p className="text-[11px] text-slate-400">Collaborators available for matching</p>
                </div>
              </div>
              <Link to="/student/teammates" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {otherStudents.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Users2 className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Not enough student profiles available yet</h4>
                <p className="text-[11px] text-slate-500">As more students register and add their skills, teammate recommendations will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherStudents.map(student => (
                  <div key={student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <Avatar
                        src={student.avatar}
                        name={student.name}
                        size="md"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{student.college || 'Student'}</p>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {student.headline || student.bio || 'Building on CONNECTOR'}
                      </p>
                    </div>

                    <Link to={`/student/profile/${student.id}`}>
                      <Button variant="secondary" size="xs" className="w-full text-[11px]">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open Collaborative Projects */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Open Project Teams</h3>
                  <p className="text-[11px] text-slate-400">Active initiatives looking for collaborators</p>
                </div>
              </div>
              <Link to="/student/projects" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {openProjects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <FolderKanban className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">No external projects found</h4>
                <p className="text-[11px] text-slate-500">Create the first project and start building your dream team!</p>
                <Link to="/student/projects/create" className="inline-block pt-1">
                  <Button variant="primary" size="xs" icon={Plus}>
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {openProjects.map(proj => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{proj.domain}</span>
                        <Badge variant="brand" size="xs">{proj.status}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-400">Lead: {proj.ownerName}</span>
                      <Link to={`/student/projects/${proj.id}`}>
                        <Button variant="ai" size="xs">
                          Join Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Opportunities */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Opportunities</h3>
              </div>
              <Link to="/student/opportunities" className="text-xs font-bold text-brand-600">
                All
              </Link>
            </div>

            {recentOpps.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No opportunities published yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentOpps.map(opp => (
                  <div key={opp.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{opp.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{opp.orgName} • {opp.stipend}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-semibold text-emerald-700">{opp.type}</span>
                      <Link to="/student/opportunities" className="font-bold text-brand-600">
                        Apply →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
              </div>
              <Link to="/student/notifications" className="text-xs font-bold text-brand-600">
                Inbox
              </Link>
            </div>

            {recentNotifs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                You're all caught up.
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifs.map(notif => (
                  <Link
                    key={notif.id}
                    to={notif.link || '/student/notifications'}
                    className="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs text-slate-700"
                  >
                    <p className="font-bold text-slate-900 line-clamp-1">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{notif.message}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
