import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { POST_TYPES } from '../../utils/constants';
import { PostComposer } from '../../components/feed/PostComposer';
import { PostCard } from '../../components/feed/PostCard';
import { Tabs } from '../../components/common/Tabs';
import {
  Sparkles,
  FolderKanban,
  Trophy,
  Briefcase,
  Users2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Feed = () => {
  const { user } = useAuth();
  const { posts, projects, opportunities, students } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Posts', icon: Sparkles },
    { id: POST_TYPES.PROJECT, label: 'Projects', icon: FolderKanban },
    { id: POST_TYPES.ACHIEVEMENT, label: 'Achievements', icon: Trophy },
    { id: POST_TYPES.OPPORTUNITY, label: 'Opportunities', icon: Briefcase },
    { id: POST_TYPES.COLLABORATION, label: 'Collaborations', icon: Users2 },
    { id: POST_TYPES.LEARNING, label: 'Learning', icon: BookOpen },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.postType === activeFilter;
  });

  const recommendedProjects = projects.slice(0, 2);
  const potentialTeammates = students.filter(s => s.id !== user?.id).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Center Main Feed (8 Columns) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Post Composer */}
        <PostComposer />

        {/* Filter Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1 shadow-sm">
          <Tabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Post Cards Stream */}
        <div className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              No posts found in this category. Be the first to share an update!
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

      </div>

      {/* Right Side Widgets (4 Columns) */}
      <div className="hidden lg:block lg:col-span-4 space-y-6">
        
        {/* AI Teammate Recommendations Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Teammate Radar</h3>
            </div>
            <Link to="/student/teammates" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {potentialTeammates.map(student => (
              <div key={student.id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{student.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{student.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/student/teammates" className="block w-full">
            <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
              Explore All Recommended Builders
            </Button>
          </Link>
        </div>

        {/* Featured Open Projects Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <FolderKanban className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Trending Projects</h3>
            </div>
            <Link to="/student/projects" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Explore
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedProjects.map(proj => (
              <div key={proj.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{proj.title}</h4>
                  <span className="text-[10px] font-bold text-brand-600 shrink-0">
                    {proj.members?.length || 1}/{proj.teamCapacity || 4}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{proj.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {proj.domain}
                  </span>
                  <Link
                    to={`/student/projects/${proj.id}`}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
