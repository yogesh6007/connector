import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';
import Tabs from '../../components/common/Tabs';
import EmptyState from '../../components/common/EmptyState';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import {
  Sparkles,
  TrendingUp,
  FileText,
  FolderGit2,
  Award,
  Briefcase,
  Bookmark,
  Users2,
  ArrowRight
} from 'lucide-react';

export default function Feed() {
  const { currentUser } = useAuth();
  const { posts, students, mentors, followingIds, toggleFollow } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Feed', icon: FileText },
    { id: 'project', label: 'Projects', icon: FolderGit2 },
    { id: 'achievement', label: 'Achievements', icon: Award },
    { id: 'opportunity', label: 'Opportunities', icon: Briefcase },
    { id: 'saved', label: 'Saved Posts', icon: Bookmark }
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'saved') return post.saved;
    if (activeFilter !== 'all') return post.type === activeFilter;
    return true;
  });

  const suggestedStudents = students.filter((s) => s.id !== currentUser.id).slice(0, 3);
  const featuredMentors = mentors.slice(0, 2);

  const trendingTags = [
    { tag: 'PyTorch', count: '142 projects' },
    { tag: 'ComputerVision', count: '98 projects' },
    { tag: 'HealthTech', count: '64 projects' },
    { tag: 'LLMAgents', count: '185 projects' },
    { tag: 'FastAPI', count: '82 projects' }
  ];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pb-12">
      {/* Main Feed Stream */}
      <div className="lg:col-span-8 space-y-6">
        {/* Post Composer */}
        <PostComposer />

        {/* Feed Filters */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <Tabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Post Stream */}
        <div className="space-y-5">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={FileText}
              title="No posts found in this category"
              description="Be the first to share an update, showcase a project, or post an opportunity!"
              actionLabel="Create Post"
              onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar: Suggestions & Trending */}
      <div className="lg:col-span-4 space-y-6 hidden lg:block">
        {/* User Mini Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center space-y-3">
          <Avatar
            src={currentUser.avatar || currentUser.logo}
            name={currentUser.name}
            size="xl"
            className="mx-auto"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{currentUser.headline || currentUser.degree}</p>
            <span className="text-[11px] text-indigo-600 font-bold">{currentUser.university || currentUser.location}</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-around text-xs">
            <div>
              <p className="font-extrabold text-slate-900">{currentUser.followersCount || 342}</p>
              <p className="text-slate-400 text-[10px]">Followers</p>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div>
              <p className="font-extrabold text-slate-900">{currentUser.followingCount || 189}</p>
              <p className="text-slate-400 text-[10px]">Following</p>
            </div>
          </div>
        </div>

        {/* Suggested Collaborators */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">People You May Know</h3>
            </div>
            <Link to="/student/explore" className="text-xs font-bold text-indigo-600 hover:underline">
              Explore
            </Link>
          </div>

          <div className="space-y-3">
            {suggestedStudents.map((student) => {
              const isFollowing = followingIds.includes(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={student.avatar} name={student.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{student.university}</p>
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant={isFollowing ? 'secondary' : 'outline'}
                    onClick={() => toggleFollow(student.id, student.name)}
                  >
                    {isFollowing ? 'Following' : '+ Follow'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Domains & Topics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Trending Technologies</h3>
          </div>

          <div className="space-y-2.5">
            {trendingTags.map((item) => (
              <div key={item.tag} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer transition">
                  #{item.tag}
                </span>
                <span className="text-[11px] text-slate-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
