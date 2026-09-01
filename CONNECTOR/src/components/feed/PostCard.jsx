import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { POST_TYPES } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  UserCheck,
  Sparkles,
  FolderKanban,
  Trophy,
  Briefcase,
  Users2,
  BookOpen,
  Send,
  Trash2,
  CornerDownRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

export const PostCard = ({ post }) => {
  const { user } = useAuth();
  const {
    likePost,
    savePost,
    sharePost,
    commentPost,
    replyComment,
    deleteComment,
    startConversation
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!post) return null;

  const isAuthorStudent = post.authorRole?.toLowerCase() === 'student';
  const isSelf = user?.id === post.authorId;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await commentPost(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    await replyComment(post.id, commentId, replyInput.trim());
    setReplyInput('');
    setActiveReplyCommentId(null);
  };

  const handleShare = async () => {
    if (post.isShared) return;
    try {
      await sharePost(post.id);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error('Error sharing post:', e);
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case POST_TYPES.PROJECT: return FolderKanban;
      case POST_TYPES.ACHIEVEMENT: return Trophy;
      case POST_TYPES.OPPORTUNITY: return Briefcase;
      case POST_TYPES.COLLABORATION: return Users2;
      case POST_TYPES.LEARNING: return BookOpen;
      default: return Sparkles;
    }
  };

  const TypeIcon = getPostTypeIcon(post.postType);

  return (
    <article className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden transition-all hover:border-slate-300/80">
      
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={isAuthorStudent ? `/student/profile/${post.authorId}` : `/organizer/profile`}>
            <Avatar
              src={post.authorAvatar}
              name={post.authorName}
              size="md"
            />
          </Link>
          
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={isAuthorStudent ? `/student/profile/${post.authorId}` : `/organizer/profile`}
                className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
              >
                {post.authorName}
              </Link>
              <Badge variant={isAuthorStudent ? 'brand' : 'ai'} size="xs">
                {post.authorRole || 'Member'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              {post.authorSubtitle || post.authorCollege || 'CONNECTOR Builder'}
            </p>
            <span className="text-[11px] text-slate-400">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Post Type Badge */}
        <div className="flex items-center gap-2">
          {post.postType && post.postType !== POST_TYPES.GENERAL && (
            <Badge variant="outline" size="xs" icon={TypeIcon} className="capitalize">
              {post.postType}
            </Badge>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Embedded Project Recruitment Card if attached */}
      {post.projectAttachment && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-brand-50/70 via-slate-50 to-indigo-50/50 border border-brand-200/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-brand-900">Featured Project Collaboration</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">{post.projectAttachment.domain}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900">{post.projectAttachment.title}</h4>

          <div className="flex flex-wrap gap-1">
            {(post.projectAttachment.requiredSkills || []).map(sk => (
              <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                {sk}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-200/40 text-xs">
            <span className="text-slate-500 font-medium">
              Team Roster: {post.projectAttachment.teamCurrent} / {post.projectAttachment.teamMax} Members
            </span>
            <Link
              to={`/student/projects/${post.projectAttachment.id}`}
              className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800"
            >
              <span>Explore & Join Team</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Embedded Opportunity Attachment Card if attached */}
      {post.opportunityAttachment && (
        <div className="mx-4 sm:mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-purple-50/40 border border-emerald-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">Verified Opportunity</span>
            </div>
            <Badge variant="success" size="xs">{post.opportunityAttachment.type}</Badge>
          </div>

          <h4 className="text-sm font-bold text-slate-900">{post.opportunityAttachment.title}</h4>
          <p className="text-xs text-slate-600">
            {post.opportunityAttachment.location} • <strong className="text-emerald-700 font-semibold">{post.opportunityAttachment.stipend}</strong>
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-200/40 text-xs">
            <span className="text-slate-500">{post.opportunityAttachment.deadline ? `Deadline: ${post.opportunityAttachment.deadline}` : 'Open Enrollment'}</span>
            <Link
              to={`/student/opportunities/${post.opportunityAttachment.id}`}
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Community & Apply</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Attached Media Image */}
      {post.media && (
        <div className="mb-3 max-h-96 overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={post.media}
            alt="Post attachment"
            className="w-full h-auto object-cover max-h-96 hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Engagement Counts Bar */}
      <div className="px-4 sm:px-5 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
            ❤️
          </span>
          <span>{post.likesCount || (post.likes || []).length} likes</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{(post.comments || []).length} comments</span>
          <span>{post.sharesCount || (post.sharedBy || []).length} shares</span>
          <span>{post.savedCount || (post.savedBy || []).length} saves</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="px-2 sm:px-4 py-1.5 border-t border-slate-100 grid grid-cols-4 gap-1">
        {/* Like */}
        <button
          onClick={() => likePost(post.id)}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
            post.isLiked
              ? 'text-rose-600 bg-rose-50/80 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
          <span>Like</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(prev => !prev)}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
            showComments
              ? 'text-brand-600 bg-brand-50 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
            post.isShared
              ? 'text-brand-600 bg-brand-50/80 font-bold cursor-default'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
          disabled={post.isShared}
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">Shared!</span>
            </>
          ) : post.isShared ? (
            <>
              <Check className="w-4 h-4 text-brand-600" />
              <span className="text-brand-600">Shared</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Save */}
        <button
          onClick={() => savePost(post.id)}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-colors ${
            post.isSaved
              ? 'text-amber-600 bg-amber-50 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          <span>{post.isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Comment Section Thread */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 space-y-4 animate-fade-in">
          
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Avatar
              src={user?.avatar || user?.logo}
              name={user?.name || 'User'}
              size="sm"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder=""
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-3 pt-2">
            {(post.comments || []).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No comments yet. Share your thoughts above!
              </p>
            ) : (
              (post.comments || []).map(comment => (
                <div key={comment.id} className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={comment.authorAvatar}
                          name={comment.authorName}
                          size="xs"
                        />
                        <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReplyCommentId(activeReplyCommentId === comment.id ? null : comment.id)}
                          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Reply
                        </button>
                        {user?.id === comment.authorId && (
                          <button
                            type="button"
                            onClick={() => deleteComment(post.id, comment.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 pl-8 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  {/* Nested Replies */}
                  {(comment.replies || []).map(reply => (
                    <div key={reply.id} className="ml-8 p-2.5 rounded-xl bg-white/90 border border-slate-200/70 flex items-start gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{reply.authorName}</span>
                          <span className="text-[10px] text-slate-400">{formatRelativeTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">{reply.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Inline Reply Form */}
                  {activeReplyCommentId === comment.id && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment.id)}
                      className="ml-8 flex gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={`Reply to ${comment.authorName}...`}
                        className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="px-2.5 py-1 bg-brand-600 text-white text-xs font-semibold rounded-lg"
                      >
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
};
