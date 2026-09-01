import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { POST_TYPES } from '../../utils/constants';
import {
  Sparkles,
  Image,
  FolderKanban,
  Trophy,
  Briefcase,
  Users2,
  BookOpen,
  Send,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';

export const PostComposer = ({ onPostCreated }) => {
  const { user, role } = useAuth();
  const { createPost, myProjects } = useApp();

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState(POST_TYPES.GENERAL);
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postTypeOptions = [
    { type: POST_TYPES.GENERAL, label: 'General', icon: Sparkles },
    { type: POST_TYPES.PROJECT, label: 'Project Idea', icon: FolderKanban },
    { type: POST_TYPES.ACHIEVEMENT, label: 'Achievement', icon: Trophy },
    { type: POST_TYPES.COLLABORATION, label: 'Collaboration', icon: Users2 },
    { type: POST_TYPES.LEARNING, label: 'Learning Update', icon: BookOpen },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let projectAttachment = null;
      if (postType === POST_TYPES.PROJECT && selectedProjectId) {
        const proj = myProjects.find(p => p.id === selectedProjectId);
        if (proj) {
          projectAttachment = {
            id: proj.id,
            title: proj.title,
            domain: proj.domain,
            requiredSkills: proj.requiredSkills,
            teamCurrent: proj.members?.length || 1,
            teamMax: proj.teamCapacity || 4
          };
        }
      }

      const newPost = await createPost({
        content: content.trim(),
        postType,
        media: mediaUrl.trim() || undefined,
        projectAttachment
      });

      setContent('');
      setMediaUrl('');
      setShowMediaInput(false);
      setSelectedProjectId('');
      setPostType(POST_TYPES.GENERAL);

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      console.error('Error submitting post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar
          src={user?.avatar || user?.logo}
          name={user?.name || 'User'}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Post Type Selector Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {postTypeOptions.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    postType === type
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Content Input Area */}
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === POST_TYPES.PROJECT
                  ? "Share what you're building, what roles you need, and who should reach out..."
                  : postType === POST_TYPES.ACHIEVEMENT
                  ? "Share a milestone, hackathon win, research paper, or certificate..."
                  : postType === POST_TYPES.COLLABORATION
                  ? "Looking for teammates for a hackathon, study group, or side project? Describe what you need..."
                  : "What do you want to share with the CONNECTOR network?"
              }
              className="w-full p-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 rounded-2xl border border-slate-200/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none resize-none"
            />

            {/* Media Attachment Field */}
            {showMediaInput && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <Image className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Paste an image URL (e.g. Unsplash or GitHub preview)..."
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaInput(false);
                    setMediaUrl('');
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Project Attachment Selector if postType is Project */}
            {postType === POST_TYPES.PROJECT && (myProjects || []).length > 0 && (
              <div className="p-2.5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-1">
                <label className="block text-[11px] font-bold text-brand-800">
                  Attach Registered Project:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2 bg-white text-xs text-slate-800 rounded-xl border border-brand-200 focus:outline-none"
                >
                  <option value="">-- Select one of your projects --</option>
                  {myProjects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <button
                  type="button"
                  onClick={() => setShowMediaInput(prev => !prev)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <Image className="w-4 h-4 text-brand-600" />
                  <span className="hidden sm:inline">Add Image</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!content.trim() || isSubmitting}
                loading={isSubmitting}
                icon={Send}
                iconPosition="right"
              >
                Post Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
