import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import CommentSection from './CommentSection';
import { formatDate } from '../../utils/helpers';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  FolderGit2,
  Briefcase,
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';

export default function PostCard({ post }) {
  const { currentUser } = useAuth();
  const { togglePostLike, togglePostSave, toggleFollow, followingIds, addToast } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const isAuthor = currentUser.id === post.author?.id;
  const isFollowing = followingIds.includes(post.author?.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Post link copied to clipboard!', 'success');
  };

  const getPostTypeBadge = (type) => {
    switch (type) {
      case 'project':
        return <Badge variant="primary" icon={FolderGit2}>Project Update</Badge>;
      case 'achievement':
        return <Badge variant="warning" icon={Award}>Achievement</Badge>;
      case 'opportunity':
        return <Badge variant="success" icon={Briefcase}>Opportunity</Badge>;
      case 'collaboration':
        return <Badge variant="ai" icon={Sparkles}>Collaboration Request</Badge>;
      case 'learning':
        return <Badge variant="info">Learning Journey</Badge>;
      default:
        return null;
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300/80 transition-all p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author?.avatar}
            name={post.author?.name}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                {post.author?.name}
              </span>
              {getPostTypeBadge(post.type)}
            </div>
            <p className="text-xs text-slate-500">{post.author?.title || post.author?.role}</p>
            <span className="text-[11px] text-slate-400">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Follow / Options Action */}
        <div className="flex items-center gap-2">
          {!isAuthor && (
            <button
              type="button"
              onClick={() => toggleFollow(post.author?.id, post.author?.name)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" /> Follow
                </>
              )}
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showOptions && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20"
                onClick={() => setShowOptions(false)}
              >
                <button
                  type="button"
                  onClick={() => addToast('Post reported for review', 'info')}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                >
                  Report Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Text Content */}
      <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
            >
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      )}

      {/* Embedded Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden border border-slate-100 max-h-96">
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full h-full object-cover hover:scale-101 transition duration-300"
          />
        </div>
      )}

      {/* Quick Project / Opportunity Attached Banner */}
      {post.projectRef && (
        <Link
          to={`/student/projects/${post.projectRef}`}
          className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 hover:bg-indigo-100/70 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                View Linked Collaboration Project
              </p>
              <p className="text-[11px] text-slate-500">Explore team roles and submit a join request</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-indigo-600" />
        </Link>
      )}

      {/* Action Buttons & Counters */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like */}
          <button
            type="button"
            onClick={() => togglePostLike(post.id)}
            className={`flex items-center gap-1.5 transition cursor-pointer ${
              post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
            />
            <span>{post.likes || 0}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{(post.comments || []).length} Comments</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={() => togglePostSave(post.id)}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            post.saved ? 'text-indigo-600 bg-indigo-50' : 'hover:text-indigo-600 hover:bg-slate-100'
          }`}
          title={post.saved ? 'Saved' : 'Save post'}
        >
          <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-indigo-600' : ''}`} />
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && <CommentSection post={post} />}
    </article>
  );
}
