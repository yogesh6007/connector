import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/common/StatCard';
import ProjectCard from '../../components/cards/ProjectCard';
import TeammateCard from '../../components/cards/TeammateCard';
import OpportunityCard from '../../components/cards/OpportunityCard';
import MentorCard from '../../components/cards/MentorCard';
import PostCard from '../../components/feed/PostCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Sparkles,
  FolderGit2,
  Users2,
  Briefcase,
  FileCheck2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Bell,
  CheckCircle2
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { projects, opportunities, applications, mentors, posts, students, notifications } = useApp();

  const myProjects = projects.filter((p) => p.owner?.id === currentUser.id);
  const myApplications = applications.filter((a) => a.studentId === currentUser.id);
  const recommendedProjects = projects.filter((p) => p.owner?.id !== currentUser.id).slice(0, 2);
  const candidateTeammates = students.filter((s) => s.id !== currentUser.id).slice(0, 2);
  const topOpportunities = opportunities.slice(0, 2);
  const activeMentors = mentors.slice(0, 2);
  const recentPosts = posts.slice(0, 2);
  const unreadNotifs = notifications.filter((n) => n.unread);

  // Profile completion calculation
  let completionScore = 60;
  if (currentUser.bio) completionScore += 10;
  if (currentUser.skills?.length >= 5) completionScore += 10;
  if (currentUser.experience?.length > 0) completionScore += 10;
  if (currentUser.portfolio) completionScore += 10;
  completionScore = Math.min(100, completionScore);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Collaboration Hub Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Welcome back, {currentUser.name?.split(' ')[0]} 👋
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            You have <strong className="text-white">{myProjects.length} active project{myProjects.length !== 1 ? 's' : ''}</strong>, <strong className="text-white">{myApplications.length} opportunity application{myApplications.length !== 1 ? 's' : ''}</strong>, and <strong className="text-white">{unreadNotifs.length} new notification{unreadNotifs.length !== 1 ? 's' : ''}</strong> today.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/student/projects/create">
              <Button variant="secondary" size="sm" icon={PlusCircle} className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold">
                Create Project
              </Button>
            </Link>
            <Link to="/student/teammates">
              <Button variant="gradient" size="sm" icon={Sparkles}>
                Find AI Teammates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completion & Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Projects"
          value={myProjects.length}
          change="+1 this month"
          icon={FolderGit2}
          color="indigo"
          subtitle="Collaborations owned"
        />
        <StatCard
          title="Applications"
          value={myApplications.length}
          change={`${myApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview').length} in review`}
          icon={FileCheck2}
          color="emerald"
          subtitle="Internships & Grants"
        />
        <StatCard
          title="Network Following"
          value={currentUser.followingCount || 24}
          change="+3 new"
          icon={Users2}
          color="purple"
          subtitle="Students & Mentors"
        />
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <span>Profile Strength</span>
              <span className="text-indigo-600 font-bold">{completionScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>
          <Link
            to="/student/profile"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between mt-3 pt-2 border-t border-slate-100"
          >
            <span>Complete Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Primary Column: Projects & AI Matches */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI Teammate Recommendations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900">AI Recommended Teammates</h2>
              </div>
              <Link
                to="/student/teammates"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All ({students.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidateTeammates.map((cand) => (
                <TeammateCard
                  key={cand.id}
                  student={cand}
                  matchScore={cand.id === 'student-2' ? 95 : 90}
                  matchReasons={[
                    `Direct skill match in ${cand.skills?.slice(0, 2).join(', ')}`,
                    `Aligned interest: ${cand.interests?.[0] || 'AI & Tech'}`,
                    `Active ${cand.availability}`
                  ]}
                />
              ))}
            </div>
          </div>

          {/* Recommended Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Recommended Collaboration Projects</h2>
              </div>
              <Link
                to="/student/projects"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>

          {/* Feed Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">From Your Network</h2>
              <Link
                to="/student/feed"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Open Full Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Opportunities, Mentors, Recent Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommended Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Top Opportunities</h3>
              </div>
              <Link to="/student/opportunities" className="text-xs font-bold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topOpportunities.map((opp) => (
                <div key={opp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{opp.organization?.name}</span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                    </div>
                    <Badge variant="primary" size="xs">{opp.type}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{opp.stipend || opp.duration}</span>
                    <Link to="/student/opportunities" className="text-indigo-600 font-bold hover:underline">
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Mentors */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Featured Mentors</h3>
              </div>
              <Link to="/student/mentors" className="text-xs font-bold text-indigo-600 hover:underline">
                Explore
              </Link>
            </div>

            <div className="space-y-3">
              {activeMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{mentor.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{mentor.organization}</p>
                    <span className="text-[10px] font-semibold text-emerald-600">{mentor.availability?.split('(')[0]}</span>
                  </div>
                  <Link to="/student/mentors">
                    <Button size="xs" variant="outline">
                      Connect
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              </div>
              <Link to="/student/notifications" className="text-xs font-bold text-indigo-600 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-900">{notif.title}</p>
                  <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">{notif.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
