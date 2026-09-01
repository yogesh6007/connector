import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES } from '../../utils/constants';
import {
  Briefcase,
  Users2,
  FolderKanban,
  FileCheck2,
  Sparkles,
  Plus,
  ArrowRight,
  Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { opportunities, applications, students, projects, updateApplicationStatus, startConversation } = useApp();
  const navigate = useNavigate();

  const myOpportunities = opportunities.filter(o => o.orgId === user?.id || o.orgName === user?.name);
  const myApplicants = applications.filter(a => a.orgId === user?.id || a.orgName === user?.name);
  const shortlistedCount = myApplicants.filter(a => a.status === APPLICATION_STATUSES.SHORTLISTED || a.status === APPLICATION_STATUSES.INTERVIEW).length;

  const handleDirectChat = (student) => {
    const convId = startConversation({
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      role: student.headline || 'Student'
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter & Innovation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user?.name || user?.organizationName || 'Organization'} Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your published opportunities, review student candidates, and explore student innovation projects.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link to="/organizer/opportunities/create">
            <Button variant="ai" size="md" icon={Plus} className="font-bold shadow-lg">
              Post Opportunity
            </Button>
          </Link>
          <Link to="/organizer/students">
            <Button variant="secondary" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Discover Talent
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <Briefcase className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myOpportunities.length}</p>
          <p className="text-[11px] text-brand-600 font-semibold">Published Listings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applicants</span>
            <FileCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{myApplicants.length}</p>
          <p className="text-[11px] text-purple-600 font-semibold">Candidates Applied</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{shortlistedCount}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">In Interview Pipeline</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Student Projects</span>
            <FolderKanban className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{projects.length}</p>
          <p className="text-[11px] text-amber-700 font-semibold">Available on Platform</p>
        </div>
      </div>

      {/* Main Grid: Left 8 Cols (Applicants), Right 4 Cols (Active Listings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Candidate Applications */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Candidate Applications</h3>
                  <p className="text-[11px] text-slate-400">Candidate review pipeline</p>
                </div>
              </div>
              <Link to="/organizer/applicants" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>Manage Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myApplicants.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">No applications received yet</h4>
                <p className="text-[11px] text-slate-500">When students apply to your open listings, candidate cards will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplicants.map(app => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{app.studentName}</h4>
                        <span className="text-[11px] text-slate-500">• {app.studentCollege || 'Student'}</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-700">{app.opportunityTitle}</p>
                      {app.coverNote && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{app.coverNote}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlist</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accept</option>
                        <option value="Rejected">Reject</option>
                      </select>

                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => handleDirectChat({ id: app.studentId, name: app.studentName, avatar: app.studentAvatar, headline: app.studentDegree })}
                      >
                        Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Talent Radar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registered Student Talent</h3>
                  <p className="text-[11px] text-slate-400">Discover builders matching your tech stack</p>
                </div>
              </div>
              <Link to="/organizer/students" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {students.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Users2 className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">No students registered yet</h4>
                <p className="text-[11px] text-slate-500">As students create their profiles on CONNECTOR, they will be discoverable here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {students.slice(0, 3).map(student => (
                  <div key={student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                      <p className="text-[10px] text-slate-500">{student.college || 'Student'}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {student.headline || student.bio || 'Building on CONNECTOR'}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="xs"
                      className="w-full text-[11px]"
                      onClick={() => handleDirectChat(student)}
                    >
                      Reach Out
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Published Opportunities */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Your Published Listings</h3>
              </div>
              <Link to="/organizer/opportunities" className="text-xs font-bold text-brand-600">
                Manage
              </Link>
            </div>

            {myOpportunities.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-2">
                <p>No listings published yet.</p>
                <Link to="/organizer/opportunities/create">
                  <Button variant="primary" size="xs" icon={Plus}>
                    Post Opportunity
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myOpportunities.map(opp => (
                  <div key={opp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">{opp.type}</span>
                      <Badge variant="success" size="xs">Active</Badge>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>{opp.applicantsCount || 0} applicants</span>
                      <Link to="/organizer/applicants" className="font-bold text-brand-600">
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
