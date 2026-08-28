import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Tabs from '../../components/common/Tabs';
import ProjectCard from '../../components/cards/ProjectCard';
import TeammateCard from '../../components/cards/TeammateCard';
import OpportunityCard from '../../components/cards/OpportunityCard';
import MentorCard from '../../components/cards/MentorCard';
import PostCard from '../../components/feed/PostCard';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Search,
  Users,
  FolderGit2,
  Building2,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function Explore() {
  const location = useLocation();
  const { students, projects, organizations, posts, opportunities, mentors, toggleFollow, followingIds } = useApp();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) setSearchTerm(q);
  }, [location.search]);

  const term = searchTerm.toLowerCase().trim();

  // Filtering entities
  const matchingStudents = students.filter(
    (s) =>
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.university?.toLowerCase().includes(term) ||
      s.skills?.some((sk) => sk.toLowerCase().includes(term)) ||
      s.interests?.some((i) => i.toLowerCase().includes(term))
  );

  const matchingProjects = projects.filter(
    (p) =>
      !term ||
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.domain?.toLowerCase().includes(term) ||
      p.requiredSkills?.some((sk) => sk.toLowerCase().includes(term))
  );

  const matchingOrgs = organizations.filter(
    (o) =>
      !term ||
      o.name?.toLowerCase().includes(term) ||
      o.industry?.toLowerCase().includes(term) ||
      o.description?.toLowerCase().includes(term)
  );

  const matchingOpportunities = opportunities.filter(
    (opp) =>
      !term ||
      opp.title?.toLowerCase().includes(term) ||
      opp.organization?.name?.toLowerCase().includes(term) ||
      opp.skills?.some((sk) => sk.toLowerCase().includes(term)) ||
      opp.type?.toLowerCase().includes(term)
  );

  const matchingMentors = mentors.filter(
    (m) =>
      !term ||
      m.name?.toLowerCase().includes(term) ||
      m.organization?.toLowerCase().includes(term) ||
      m.expertise?.some((e) => e.toLowerCase().includes(term))
  );

  const matchingPosts = posts.filter(
    (p) =>
      !term ||
      p.content?.toLowerCase().includes(term) ||
      p.tags?.some((t) => t.toLowerCase().includes(term))
  );

  const totalResults =
    matchingStudents.length +
    matchingProjects.length +
    matchingOrgs.length +
    matchingOpportunities.length +
    matchingMentors.length +
    matchingPosts.length;

  const exploreTabs = [
    { id: 'all', label: 'All Results', count: totalResults },
    { id: 'students', label: 'People / Students', count: matchingStudents.length, icon: Users },
    { id: 'projects', label: 'Projects', count: matchingProjects.length, icon: FolderGit2 },
    { id: 'organizations', label: 'Organizations', count: matchingOrgs.length, icon: Building2 },
    { id: 'opportunities', label: 'Opportunities', count: matchingOpportunities.length, icon: Briefcase },
    { id: 'mentors', label: 'Mentors', count: matchingMentors.length, icon: GraduationCap },
    { id: 'posts', label: 'Posts & Feed', count: matchingPosts.length, icon: FileText }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explore CONNECTOR</h1>
          <p className="text-xs text-slate-500">
            Search across people, project ideas, organizations, opportunities, and mentors
          </p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keywords, skills (e.g. Python, PyTorch), domains, or universities..."
            className="w-full pl-12 pr-4 py-3 bg-white text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={exploreTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Results Rendering */}
      <div className="space-y-8">
        {/* ALL TAB */}
        {activeTab === 'all' && (
          <>
            {/* Top Students / People */}
            {matchingStudents.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    People & Teammates ({matchingStudents.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All People →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingStudents.slice(0, 3).map((st) => (
                    <TeammateCard key={st.id} student={st} />
                  ))}
                </div>
              </div>
            )}

            {/* Top Projects */}
            {matchingProjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-purple-600" />
                    Projects ({matchingProjects.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Projects →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingProjects.slice(0, 2).map((proj) => (
                    <ProjectCard key={proj.id} project={proj} />
                  ))}
                </div>
              </div>
            )}

            {/* Top Opportunities */}
            {matchingOpportunities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Opportunities ({matchingOpportunities.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Opportunities →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingOpportunities.slice(0, 2).map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* SPECIFIC TABS */}
        {activeTab === 'students' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingStudents.map((st) => (
              <TeammateCard key={st.id} student={st} />
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matchingOrgs.map((org) => {
              const isFollowing = followingIds.includes(org.id);
              return (
                <div key={org.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Avatar src={org.logo} name={org.name} size="lg" />
                      <Badge variant="primary">{org.type?.split('&')[0]}</Badge>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{org.name}</h3>
                      <p className="text-xs text-slate-500">{org.industry}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{org.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{org.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{org.followersCount || 2000} Followers</span>
                    <Button
                      size="xs"
                      variant={isFollowing ? 'secondary' : 'gradient'}
                      onClick={() => toggleFollow(org.id, org.name)}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matchingMentors.map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="max-w-3xl space-y-4">
            {matchingPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {totalResults === 0 && (
          <EmptyState
            icon={Search}
            title={`No results found for "${searchTerm}"`}
            description="Try searching with different keywords, technology names (e.g. Python, React), or domains."
            actionLabel="Clear Search"
            onAction={() => setSearchTerm('')}
          />
        )}
      </div>
    </div>
  );
}
