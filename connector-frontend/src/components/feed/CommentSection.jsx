import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { Send, CornerDownRight } from 'lucide-react';

export default function CommentSection({ post }) {
  const { currentUser } = useAuth();
  const { addComment, addReply } = useApp();
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;
    addReply(post.id, commentId, replyText.trim());
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="pt-3 border-t border-slate-100 space-y-3">
      {/* New Comment Input */}
      <form onSubmit={handlePostComment} className="flex gap-2.5 items-start">
        <Avatar src={currentUser.avatar || currentUser.logo} name={currentUser.name} size="sm" />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment or thought..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!commentText.trim()}
            icon={Send}
            variant="primary"
          >
            Send
          </Button>
        </div>
      </form>

      {/* List of comments */}
      <div className="space-y-3 pt-2">
        {(post.comments || []).map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex gap-2.5 items-start bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <Avatar src={comment.author?.avatar} name={comment.author?.name} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{comment.author?.name}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{comment.content}</p>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {(comment.replies || []).map((reply) => (
              <div key={reply.id} className="ml-8 flex gap-2.5 items-start bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/50">
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                <Avatar src={reply.author?.avatar} name={reply.author?.name} size="xs" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{reply.author?.name}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">{reply.content}</p>
                </div>
              </div>
            ))}

            {/* Reply Input Box */}
            {replyingToId === comment.id && (
              <div className="ml-8 flex gap-2 items-center pt-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author?.name}...`}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handlePostReply(comment.id);
                    }
                  }}
                />
                <Button
                  size="xs"
                  onClick={() => handlePostReply(comment.id)}
                  disabled={!replyText.trim()}
                  variant="primary"
                >
                  Reply
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
