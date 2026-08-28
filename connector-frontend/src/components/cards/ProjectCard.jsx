import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import {
  Users,
  Clock,
  MapPin,
  Bookmark,
  Sparkles,
  ArrowRight,
  Send,
  ExternalLink,
  Layers
} from 'lucide-react';
import { getStatusBadgeColor } from '../../utils/helpers';

export default function ProjectCard({ project, onJoinClick }) {
  const { currentUser, isStudent } = useAuth();
  const { savedProjectIds, toggleSaveProject, submitJoinRequest } = useApp();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(project.openPositions?.[0]?.title || 'Teammate');
  const [joinMessage, setJoinMessage] = useState('');

  const isSaved = savedProjectIds.includes(project.id);
  const isOwner = currentUser?.id === project.owner?.id;
  const isMember = project.members?.some((m) => m.id === currentUser?.id);
  const hasRequested = project.joinRequests?.some((r) => r.studentId === currentUser?.id);

  const handleSendJoinRequest = (e) => {
    e.preventDefault();
    submitJoinRequest(project.id, {
      appliedRole: selectedRole,
      message: joinMessage || `Hi! I would love to collaborate on ${project.title} as a ${selectedRole}.`,
      matchScore: 92
    });
    setIsJoinModalOpen(false);
    setJoinMessage('');
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group">
        <div>
          {/* Header Row: Domain & Save Action */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge variant="primary" icon={Layers}>
              {project.domain}
            </Badge>

            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(project.status)}`}>
                {project.status}
              </span>
              <button
                type="button"
                onClick={() => toggleSaveProject(project.id)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Saved' : 'Bookmark'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Project Title */}
          <Link to={`/student/projects/${project.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 mb-2 leading-snug">
              {project.title}
            </h3>
          </Link>

          {/* Project Description */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Skills Required */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(project.requiredSkills || []).slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {(project.requiredSkills || []).length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                +{project.requiredSkills.length - 4} more
              </span>
            )}
          </div>

          {/* Meta Information Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>{project.currentTeamSize} / {project.teamSize} Team</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{project.workMode}</span>
            </div>
          </div>
        </div>

        {/* Footer: Creator info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar
              src={project.owner?.avatar}
              name={project.owner?.name}
              size="sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">{project.owner?.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{project.owner?.university}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/student/projects/${project.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>

            {isStudent && !isOwner && !isMember && project.lookingForTeammates && (
              <Button
                variant="gradient"
                size="sm"
                disabled={hasRequested}
                onClick={() => setIsJoinModalOpen(true)}
              >
                {hasRequested ? 'Requested' : 'Join Team'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title={`Request to Join: ${project.title}`}
        subtitle="Submit your application to the project leader."
      >
        <form onSubmit={handleSendJoinRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Desired Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {(project.openPositions || []).map((pos) => (
                <option key={pos.id} value={pos.title}>
                  {pos.title} ({pos.skills?.join(', ')})
                </option>
              ))}
              <option value="Full Stack Contributor">General Technical Contributor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Note to Project Leader
            </label>
            <textarea
              rows={4}
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Explain why you are excited to work on this project and how your skills fit the role..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Your skills ({currentUser?.skills?.slice(0, 3).join(', ')}) will be shared with the leader for AI matching.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
              Submit Join Request
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
