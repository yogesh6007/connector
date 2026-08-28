import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { POST_TYPES } from '../../utils/constants';
import {
  Image,
  FolderGit2,
  Award,
  Sparkles,
  Send,
  X,
  Tag,
  Briefcase,
  BookOpen
} from 'lucide-react';

export default function PostComposer({ onPostCreated }) {
  const { currentUser } = useAuth();
  const { createPost, projects } = useApp();

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const post = createPost({
      content: content.trim(),
      type: postType,
      tags,
      image: imageUrl.trim() || null,
      projectRef: selectedProjectId || null
    });

    setContent('');
    setTagsInput('');
    setImageUrl('');
    setSelectedProjectId('');
    setShowImageInput(false);
    setShowProjectPicker(false);
    setPostType('general');

    if (onPostCreated) onPostCreated(post);
  };

  const getIconForType = (typeId) => {
    switch (typeId) {
      case 'project':
        return FolderGit2;
      case 'achievement':
        return Award;
      case 'collaboration':
        return Sparkles;
      case 'opportunity':
        return Briefcase;
      case 'learning':
        return BookOpen;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Top: Avatar & Textarea */}
        <div className="flex gap-3 items-start">
          <Avatar
            src={currentUser.avatar || currentUser.logo}
            name={currentUser.name}
            size="md"
          />
          <div className="flex-1">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you building, learning, or looking to collaborate on?"
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none resize-none"
            />
          </div>
        </div>

        {/* Post Type Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {POST_TYPES.map((type) => {
            const Icon = getIconForType(type.id);
            const isSelected = postType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setPostType(type.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Optional Extra Inputs: Image */}
        {showImageInput && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
            <Image className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
              className="flex-1 text-xs bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowImageInput(false);
                setImageUrl('');
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Optional Extra Inputs: Project Reference */}
        {showProjectPicker && (
          <div className="flex items-center gap-2 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-fade-in">
            <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none font-medium text-indigo-900"
            >
              <option value="">Select a project to attach...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setShowProjectPicker(false);
                setSelectedProjectId('');
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tags input bar */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Add tags separated by comma (e.g. Python, AI, React, Hackathon)"
            className="flex-1 text-xs bg-transparent outline-none placeholder-slate-400"
          />
        </div>

        {/* Bottom Bar: Action triggers & Post button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              <Image className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowProjectPicker(!showProjectPicker)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Attach Project</span>
            </button>
          </div>

          <Button
            type="submit"
            disabled={!content.trim()}
            variant="gradient"
            size="sm"
            icon={Send}
            iconPosition="right"
          >
            Post Update
          </Button>
        </div>
      </form>
    </div>
  );
}
