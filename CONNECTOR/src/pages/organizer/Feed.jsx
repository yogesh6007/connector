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
  PlusCircle
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const OrganizerFeed = () => {
  const { user } = useAuth();
  const { posts, opportunities, projects, students } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Posts', icon: Sparkles },
    { id: POST_TYPES.OPPORTUNITY, label: 'Opportunities & Grants', icon: Briefcase },
    { id: POST_TYPES.PROJECT, label: 'Student Innovations', icon: FolderKanban },
    { id: POST_TYPES.ACHIEVEMENT, label: 'Student Wins', icon: Trophy },
    { id: POST_TYPES.COLLABORATION, label: 'Collaborations', icon: Users2 }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.postType === activeFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Center Feed */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Post Composer for Organizer */}
        <PostComposer />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1 shadow-sm">
          <Tabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Post List */}
        <div className="space-y-5">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

      </div>

      {/* Right Column: Organizer Quick Actions */}
      <div className="hidden lg:block lg:col-span-4 space-y-6">
        
        {/* Recruiter Quick Publish Banner */}
        <div className="bg-gradient-to-br from-purple-900 via-brand-900 to-slate-900 text-white rounded-2xl p-5 shadow-elevated space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-300" />
            <h3 className="text-sm font-bold text-white">Publish Opportunities</h3>
          </div>
          <p className="text-xs text-purple-200/80 leading-relaxed">
            Post an internship, hackathon sponsorship, or student venture grant directly to the CONNECTOR student talent pool.
          </p>
          <Link to="/organizer/opportunities/create" className="block pt-1">
            <Button variant="ai" size="sm" className="w-full font-bold" icon={PlusCircle}>
              Create New Opportunity
            </Button>
          </Link>
        </div>

        {/* Top Student Innovation Spotlight */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Student Projects Spotlight</h3>
            </div>
            <Link to="/organizer/projects" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Browse All
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 2).map(proj => (
              <div key={proj.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{proj.description}</p>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="font-semibold text-brand-600">{proj.ownerName} ({proj.ownerCollege})</span>
                  <Link to={`/student/projects/${proj.id}`} className="font-bold text-slate-700 hover:text-brand-600">
                    Review →
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
