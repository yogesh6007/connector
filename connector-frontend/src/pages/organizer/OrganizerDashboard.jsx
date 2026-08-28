import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import AiMatchBadge from '../../components/ai/AiMatchBadge';
import {
  Briefcase,
  Users,
  FolderGit2,
  HeartHandshake,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { formatDate, getStatusBadgeColor } from '../../utils/helpers';

export default function OrganizerDashboard() {
  const { currentUser } = useAuth();
  const { opportunities, applications, projects, students, mentorshipRequests } = useApp();

  const myOpportunities = opportunities.filter(
    (o) => o.organization?.id === currentUser.id || o.organization?.name === currentUser.name
  );
  const activeOpportunities = myOpportunities.length > 0 ? myOpportunities : opportunities.slice(0, 2);

  const pendingApplicants = applications.filter((a) => ['Applied', 'Under Review'].includes(a.status));
  const shortlistedApplicants = applications.filter((a) => ['Shortlisted', 'Interview'].includes(a.status));
  const candidateStudents = students.slice(0, 3);
  const studentProjects = projects.slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Organization Talent & Project Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {currentUser.name}
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Manage your opportunities, review AI-scored candidate applications, discover ambitious student projects, and connect with emerging tech leaders.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/organizer/opportunities/create">
              <Button variant="gradient" size="sm" icon={PlusCircle}>
                Publish Opportunity
              </Button>
            </Link>
            <Link to="/organizer/applicants">
              <Button variant="secondary" size="sm" icon={Users} className="bg-white text-purple-950 hover:bg-purple-50 font-bold">
                Review Applicants ({applications.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Opportunities"
          value={activeOpportunities.length}
          change="+2 published"
          icon={Briefcase}
          color="indigo"
          subtitle="Internships & Grants"
        />
        <StatCard
          title="Total Applicants"
          value={applications.length}
          change={`${pendingApplicants.length} pending review`}
          icon={Users}
          color="purple"
          subtitle="AI-scored candidates"
        />
        <StatCard
          title="Shortlisted / Interview"
          value={shortlistedApplicants.length}
          change="Top 15% tier"
          icon={CheckCircle2}
          color="emerald"
          subtitle="In pipeline"
        />
        <StatCard
          title="Mentored Projects"
          value={currentUser.mentoredProjectsCount || 12}
          change="+3 this quarter"
          icon={HeartHandshake}
          color="amber"
          subtitle="Collaborations backed"
        />
      </div>

      {/* 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Primary Column: Recent Applicants & Student Projects */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent Applicants Review */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Recent Candidate Applicants
                </h2>
                <p className="text-xs text-slate-500">Evaluated by multi-vector AI talent match scoring</p>
              </div>

              <Link to="/organizer/applicants" className="text-xs font-bold text-indigo-600 hover:underline">
                View All ({applications.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={app.studentAvatar} name={app.studentName} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{app.studentName}</h3>
                        <AiMatchBadge score={app.matchScore || 92} size="xs" />
                      </div>
                      <p className="text-xs text-slate-500">{app.studentHeadline}</p>
                      <span className="text-[11px] text-slate-400">
                        Applied for <strong className="text-indigo-600">{app.opportunityTitle}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(app.status)}`}>
                      {app.status}
                    </span>
                    <Link to="/organizer/applicants">
                      <Button size="xs" variant="outline">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Projects Seeking Sponsorship & Mentorship */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-purple-600" />
                  Student Projects Seeking Collaboration
                </h2>
                <p className="text-xs text-slate-500">Sponsor capstone ideas or offer organizational mentorship</p>
              </div>

              <Link to="/organizer/projects" className="text-xs font-bold text-indigo-600 hover:underline">
                Discover More →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentProjects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
                  <div>
                    <Badge variant="primary" size="xs">{proj.domain}</Badge>
                    <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">By {proj.owner?.name}</span>
                    <Link to="/organizer/projects">
                      <Button size="xs" variant="gradient">
                        Offer Mentorship
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Active Opportunities & Recommended Students */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Active Opportunities
              </h3>
              <Link to="/organizer/opportunities" className="text-xs font-bold text-indigo-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {activeOpportunities.map((opp) => (
                <div key={opp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                    <Badge variant="success" size="xs">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                    <span>{opp.applicantsCount || 0} applicants</span>
                    <span>Due {opp.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Students Talent Spotlight */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Top Recommended Talent
              </h3>
              <Link to="/organizer/students" className="text-xs font-bold text-indigo-600 hover:underline">
                Search
              </Link>
            </div>

            <div className="space-y-3">
              {candidateStudents.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={st.avatar} name={st.name} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{st.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{st.university}</p>
                    </div>
                  </div>
                  <Link to={`/organizer/students/${st.id}`}>
                    <Button size="xs" variant="outline">
                      Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
