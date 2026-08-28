import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TeammateCard from '../../components/cards/TeammateCard';
import {
  FolderGit2,
  Users,
  Clock,
  MapPin,
  Globe,
  Bookmark,
  MessageSquare,
  Sparkles,
  Send,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { GithubIcon } from '../../components/common/BrandIcons';
import { getStatusBadgeColor } from '../../utils/helpers';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();
  const { projects, students, submitJoinRequest, startConversation, savedProjectIds, toggleSaveProject } = useApp();

  const project = projects.find((p) => p.id === id) || projects[0];

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(project.openPositions?.[0]?.title || 'Teammate');
  const [joinMessage, setJoinMessage] = useState('');

  const isSaved = savedProjectIds.includes(project.id);
  const isOwner = currentUser?.id === project.owner?.id;
  const isMember = project.members?.some((m) => m.id === currentUser?.id);
  const hasRequested = project.joinRequests?.some((r) => r.studentId === currentUser?.id);

  // Recommended candidates for this project
  const candidateTeammates = students.filter((s) => s.id !== project.owner?.id).slice(0, 2);

  const handleSendJoinRequest = (e) => {
    e.preventDefault();
    submitJoinRequest(project.id, {
      appliedRole: selectedRole,
      message: joinMessage || `Hi! I would love to collaborate on ${project.title} as a ${selectedRole}.`,
      matchScore: 94
    });
    setIsJoinModalOpen(false);
    setJoinMessage('');
  };

  const handleMessageLeader = () => {
    startConversation(project.owner);
    navigate('/student/messages');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Back button */}
      <Link
        to="/student/projects"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Projects</span>
      </Link>

      {/* Main Dossier Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{project.domain}</Badge>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getStatusBadgeColor(project.status)}`}>
                {project.status}
              </span>
              <Badge variant="ai">{project.complexity || 'Intermediate'} Complexity</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>Created by <strong className="text-slate-900">{project.owner?.name}</strong></span>
              <span>•</span>
              <span>{project.owner?.university}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleSaveProject(project.id)}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Saved' : 'Save project'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
            </button>

            {!isOwner && (
              <Button
                variant="outline"
                size="md"
                icon={MessageSquare}
                onClick={handleMessageLeader}
              >
                Message Leader
              </Button>
            )}

            {isStudent && !isOwner && !isMember && project.lookingForTeammates && (
              <Button
                variant="gradient"
                size="md"
                disabled={hasRequested}
                onClick={() => setIsJoinModalOpen(true)}
                icon={Sparkles}
              >
                {hasRequested ? 'Request Submitted' : 'Request to Join Team'}
              </Button>
            )}
          </div>
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Team Capacity</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{project.currentTeamSize} / {project.teamSize} Members</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Duration</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{project.duration}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Work Mode</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{project.workMode}</p>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">Recruitment</span>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">
              {project.lookingForTeammates ? 'Active' : 'Closed'}
            </p>
          </div>
        </div>

        {/* Project Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About this Project</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Technology Stack */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {(project.requiredSkills || []).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.githubLink || project.demoLink) && (
          <div className="pt-2 flex flex-wrap gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
              >
                <Globe className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* 2-Column Section: Team Members & Open Positions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Team Members */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Current Team Members ({project.members?.length || 1})
          </h2>

          <div className="space-y-3">
            {(project.members || []).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="md" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{member.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>
                {member.id === project.owner?.id && (
                  <Badge variant="primary" size="xs">Project Lead</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Open Technical Roles */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Open Technical Positions ({project.openPositions?.length || 0})
          </h2>

          <div className="space-y-3">
            {(project.openPositions || []).map((pos) => (
              <div key={pos.id} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{pos.title}</h3>
                  <Badge variant="ai" size="xs">Open</Badge>
                </div>
                <p className="text-[11px] text-slate-600">{pos.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(pos.skills || []).map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-white text-purple-700 font-semibold border border-purple-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Teammate Recommendations for this Project */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">AI Recommended Teammates for this Project</h2>
          </div>
          <Link to="/student/teammates" className="text-xs font-bold text-indigo-600 hover:underline">
            Search All Teammates →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {candidateTeammates.map((cand) => (
            <TeammateCard
              key={cand.id}
              student={cand}
              matchScore={cand.id === 'student-2' ? 96 : 89}
              matchReasons={[
                `Strong expertise in ${project.requiredSkills?.[0] || 'Python'} and ${project.requiredSkills?.[1] || 'PyTorch'}`,
                `High interest affinity for ${project.domain}`,
                `Available ${cand.availability}`
              ]}
            />
          ))}
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
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            >
              {(project.openPositions || []).map((pos) => (
                <option key={pos.id} value={pos.title}>
                  {pos.title} ({pos.skills?.join(', ')})
                </option>
              ))}
              <option value="Technical Contributor">Technical Contributor</option>
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
              placeholder="Explain your motivation, technical skills, and why you are excited to collaborate on this project..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
              Send Join Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
