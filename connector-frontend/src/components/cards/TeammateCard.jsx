import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import AiMatchBadge from '../ai/AiMatchBadge';
import Modal from '../common/Modal';
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Clock,
  MessageSquare,
  UserPlus,
  Send,
  ExternalLink
} from 'lucide-react';

export default function TeammateCard({
  student,
  matchScore = 88,
  matchReasons = [],
  matchingSkills = [],
  onInvite
}) {
  const { currentUser } = useAuth();
  const { startConversation, toggleFollow, followingIds, projects, addToast } = useApp();
  const navigate = useNavigate();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  const isFollowing = followingIds.includes(student.id);
  const myProjects = projects.filter((p) => p.owner?.id === currentUser.id);

  const handleMessage = () => {
    startConversation(student);
    navigate('/student/messages');
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      addToast('Please select a project to invite this teammate to', 'error');
      return;
    }
    const proj = projects.find((p) => p.id === selectedProjectId);
    addToast(`Invitation sent to ${student.name} to join "${proj?.title}"!`, 'success');
    setIsInviteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between group">
        <div>
          {/* Top Header: Avatar, Name, and AI Match Score */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Avatar src={student.avatar} name={student.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                  {student.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{student.headline}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-indigo-500" />
                    {student.university}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {student.location}
                  </span>
                </div>
              </div>
            </div>

            <AiMatchBadge score={matchScore || student.matchScore || 85} size="sm" />
          </div>

          {/* Bio snippet */}
          {student.bio && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {student.bio}
            </p>
          )}

          {/* AI Match Factors Box */}
          <div className="p-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/40 rounded-xl border border-indigo-100/70 mb-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-950 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Why this match?</span>
            </div>

            <ul className="space-y-1">
              {(matchReasons.length > 0
                ? matchReasons
                : [
                    `Matched skills: ${student.skills?.slice(0, 3).join(', ')}`,
                    `Aligned with domain interest: ${student.interests?.[0] || 'AI & Tech'}`,
                    `Active availability: ${student.availability || '15+ hrs/week'}`
                  ]
              ).map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(student.skills || []).slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
            {(student.skills || []).length > 5 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                +{student.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={MessageSquare}
              onClick={handleMessage}
            >
              Message
            </Button>

            <button
              type="button"
              onClick={() => toggleFollow(student.id, student.name)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
              title={isFollowing ? 'Following' : 'Follow student'}
            >
              <UserPlus className={`w-4 h-4 ${isFollowing ? 'text-indigo-600' : ''}`} />
            </button>
          </div>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            icon={Sparkles}
          >
            Invite to Team
          </Button>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`Invite ${student.name} to Collaborate`}
        subtitle="Select which of your projects you would like to invite this student to join."
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Your Project *
            </label>
            {myProjects.length > 0 ? (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                required
              >
                <option value="">Choose a project...</option>
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.currentTeamSize}/{p.teamSize} members)
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                You haven't created any projects yet. Please create a project first from the "New Project" page to invite teammates.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proposed Role
            </label>
            <input
              type="text"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              placeholder="e.g. Computer Vision Engineer, Frontend Lead..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Personalized Invitation Note
            </label>
            <textarea
              rows={3}
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder={`Hi ${student.name}, our AI matcher highlighted your profile as a fantastic fit for our project. We would love to collaborate!`}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={myProjects.length === 0}
              icon={Send}
              iconPosition="right"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
