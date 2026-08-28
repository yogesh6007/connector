import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import PostComposer from '../../components/feed/PostComposer';
import PostCard from '../../components/feed/PostCard';
import Tabs from '../../components/common/Tabs';
import EmptyState from '../../components/common/EmptyState';
import { FileText, Briefcase, Award, FolderGit2 } from 'lucide-react';

export default function OrganizerFeed() {
  const { posts } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Updates', icon: FileText },
    { id: 'opportunity', label: 'Opportunities & Grants', icon: Briefcase },
    { id: 'project', label: 'Student Projects', icon: FolderGit2 },
    { id: 'achievement', label: 'Student Achievements', icon: Award }
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeFilter !== 'all') return post.type === activeFilter;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem Updates & Feed</h1>
        <p className="text-xs text-slate-500">
          Share announcements, grant openings, and discover breakthrough student projects
        </p>
      </div>

      {/* Post Composer for Organizer */}
      <PostComposer />

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={filterTabs} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Posts Stream */}
      <div className="space-y-5">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts in this category"
            description="Share your first opportunity or organizational update with the community."
          />
        )}
      </div>
    </div>
  );
}
