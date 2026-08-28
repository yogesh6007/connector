import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SkillTagInput from '../../components/common/SkillTagInput';
import ProjectCard from '../../components/cards/ProjectCard';
import PostCard from '../../components/feed/PostCard';
import Tabs from '../../components/common/Tabs';
import {
  GraduationCap,
  MapPin,
  Mail,
  Globe,
  Edit3,
  Award,
  Briefcase,
  BookOpen,
  Sparkles,
  FolderGit2,
  FileText
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/BrandIcons';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { projects, posts, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit state
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editHeadline, setEditHeadline] = useState(currentUser.headline || '');
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editUniversity, setEditUniversity] = useState(currentUser.university || '');
  const [editDegree, setEditDegree] = useState(currentUser.degree || '');
  const [editLocation, setEditLocation] = useState(currentUser.location || '');
  const [editSkills, setEditSkills] = useState(currentUser.skills || []);
  const [editGithub, setEditGithub] = useState(currentUser.github || '');
  const [editLinkedin, setEditLinkedin] = useState(currentUser.linkedin || '');
  const [editPortfolio, setEditPortfolio] = useState(currentUser.portfolio || '');

  const userProjects = projects.filter((p) => p.owner?.id === currentUser.id);
  const userPosts = posts.filter((p) => p.author?.id === currentUser.id);

  const profileTabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'projects', label: `Projects (${userProjects.length})`, icon: FolderGit2 },
    { id: 'posts', label: `Activity (${userPosts.length})`, icon: FileText }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      headline: editHeadline,
      bio: editBio,
      university: editUniversity,
      degree: editDegree,
      location: editLocation,
      skills: editSkills,
      github: editGithub,
      linkedin: editLinkedin,
      portfolio: editPortfolio
    });
    setIsEditModalOpen(false);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Profile Dossier Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative">
          {currentUser.banner && (
            <img
              src={currentUser.banner}
              alt="Banner"
              className="w-full h-full object-cover opacity-40"
            />
          )}
        </div>

        {/* Info & Avatar */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="2xl"
              className="ring-4 ring-white shadow-xl bg-white"
            />

            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Portfolio Profile
            </Button>
          </div>

          {/* Name & Bio Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentUser.name}</h1>
                <Badge variant="primary" size="xs">Student</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-1">{currentUser.headline}</p>
            </div>

            {/* University & Location badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <GraduationCap className="w-4 h-4" />
                {currentUser.university} • {currentUser.degree} ({currentUser.gradYear || '2026'})
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser.email}
              </span>
            </div>

            {/* Bio */}
            {currentUser.bio && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl pt-1">
                {currentUser.bio}
              </p>
            )}

            {/* Social & Portfolio Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {currentUser.github && (
                <a
                  href={currentUser.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {currentUser.linkedin && (
                <a
                  href={currentUser.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {currentUser.portfolio && (
                <a
                  href={currentUser.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio Site</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Experience, Education, Achievements */}
          <div className="lg:col-span-8 space-y-6">
            {/* Experience Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Internship & Research Experience
              </h2>

              <div className="space-y-4">
                {(currentUser.experience || [
                  {
                    id: 'e1',
                    title: 'ML Research Intern',
                    organization: 'Stanford Vision & Learning Lab',
                    period: 'Jun 2025 - Present',
                    description: 'Working on multimodal vision-language models for real-time spatial synthesis.'
                  }
                ]).map((exp) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                      <span className="text-[10px] font-semibold text-slate-400">{exp.period}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">{exp.organization}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Education & Academics
              </h2>

              <div className="space-y-3">
                {(currentUser.education || [
                  {
                    id: 'edu1',
                    institution: currentUser.university || 'Stanford University',
                    degree: currentUser.degree || 'B.S. in Computer Science',
                    period: `2022 - ${currentUser.gradYear || '2026'}`,
                    gpa: '3.92 / 4.0'
                  }
                ]).map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{edu.institution}</h3>
                      <p className="text-xs text-slate-600 font-medium">{edu.degree}</p>
                      <span className="text-[11px] text-slate-400">{edu.period}</span>
                    </div>
                    {edu.gpa && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements & Awards */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Achievements & Hackathons
              </h2>

              <ul className="space-y-2">
                {(currentUser.achievements || [
                  '1st Place - CalHacks 2025 (AI Assistive Category)',
                  'Dean’s Honors List (2023, 2024, 2025)',
                  'Author of PyTorch open-source library (1.2k GitHub Stars)'
                ]).map((ach, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Skills & Certifications */}
          <div className="lg:col-span-4 space-y-6">
            {/* Technical Skills */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical Stack & Skills
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {(currentUser.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Certifications
              </h2>

              <div className="space-y-2">
                {(currentUser.certifications || [
                  'DeepLearning.AI Deep Learning Specialization',
                  'AWS Certified Solutions Architect Associate'
                ]).map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                    ✓ {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="max-w-3xl space-y-4">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Portfolio Profile"
        subtitle="Update your student credentials, bio, and technical skills."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              About / Bio
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                University
              </label>
              <input
                type="text"
                value={editUniversity}
                onChange={(e) => setEditUniversity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Degree
              </label>
              <input
                type="text"
                value={editDegree}
                onChange={(e) => setEditDegree(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <SkillTagInput
            selectedSkills={editSkills}
            onChange={setEditSkills}
            label="Technical Skills"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={editGithub}
                onChange={(e) => setEditGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={editLinkedin}
                onChange={(e) => setEditLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Portfolio Site
              </label>
              <input
                type="url"
                value={editPortfolio}
                onChange={(e) => setEditPortfolio(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
