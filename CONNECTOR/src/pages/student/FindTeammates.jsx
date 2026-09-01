import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { PROJECT_DOMAINS, POPULAR_SKILLS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Users2,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Globe,
  Layers
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const FindTeammates = () => {
  const { user } = useAuth();
  const { projects, myProjects, recruitingProjects, sendProjectInterest, startConversation } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('find-candidates'); // 'find-candidates' | 'browse-projects'
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateError, setCandidateError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Interest Modal State
  const [selectedProjForInterest, setSelectedProjForInterest] = useState(null);
  const [interestMessage, setInterestMessage] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [interestError, setInterestError] = useState('');

  const ownedProjects = (myProjects || []).filter(p => p.ownerId === user?.id);

  useEffect(() => {
    if (ownedProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(ownedProjects[0].id);
    }
  }, [ownedProjects, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      const fetchMatches = async () => {
        setLoadingCandidates(true);
        setCandidateError('');
        try {
          const result = await aiService.matchTeammates(selectedProjectId);
          if (result.notEnoughData) {
            setCandidates([]);
          } else {
            setCandidates(result.candidates || []);
          }
        } catch (err) {
          console.error('Error fetching teammate matches:', err);
          setCandidateError('Failed to calculate candidate matches. Please try again.');
        } finally {
          setLoadingCandidates(false);
        }
      };
      fetchMatches();
    } else {
      setCandidates([]);
    }
  }, [selectedProjectId]);

  // Active recruiting projects
  const activeRecruitingList = (recruitingProjects && recruitingProjects.length > 0 ? recruitingProjects : projects)
    .filter(p => p.status === 'Recruiting' && (p.members || []).length < (p.teamCapacity || 4));

  const filteredProjects = activeRecruitingList.filter(proj => {
    if (selectedDomain !== 'all' && proj.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title?.toLowerCase().includes(q);
      const matchDesc = proj.description?.toLowerCase().includes(q);
      const matchSkills = (proj.requiredSkills || []).some(s => s.toLowerCase().includes(q));
      const matchRoles = (proj.requiredRoles || []).some(r => (typeof r === 'string' ? r : r.role).toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills && !matchRoles) return false;
    }
    return true;
  });

  const handleOpenInterestModal = (project) => {
    setSelectedProjForInterest(project);
    setInterestError('');
    setInterestSuccess(false);
    const suggestedRole = Array.isArray(project.requiredRoles) && project.requiredRoles.length > 0
      ? (typeof project.requiredRoles[0] === 'string' ? project.requiredRoles[0] : project.requiredRoles[0].role)
      : 'Developer / Collaborator';
    setRoleApplied(suggestedRole);
    setInterestMessage(`Hi ${project.ownerName}, I'm interested in contributing to ${project.title}. I have experience with ${(project.requiredSkills || []).slice(0, 3).join(', ')} and would love to collaborate on the team.`);
  };

  const handleSendInterest = async (e) => {
    e.preventDefault();
    if (!selectedProjForInterest) return;
    setIsSubmittingInterest(true);
    setInterestError('');

    try {
      await sendProjectInterest(selectedProjForInterest.id, {
        message: interestMessage,
        roleApplied
      });
      setInterestSuccess(true);
      setTimeout(() => {
        setSelectedProjForInterest(null);
        setInterestSuccess(false);
      }, 1800);
    } catch (err) {
      setInterestError(err.message || 'Failed to submit interest request.');
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  const handleDirectMessageLeader = (project) => {
    startConversation({
      id: project.ownerId,
      name: project.ownerName,
      avatar: project.ownerAvatar,
      role: `Leader of ${project.title}`
    });
    navigate('/student/messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 text-xs font-bold border border-brand-500/30">
            <Users2 className="w-3.5 h-3.5" />
            <span>Teammate Formation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Projects Looking for Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Discover active collaborative projects with open roles, or publish your own project to find teammates who share your vision.
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <Link to="/student/projects/create">
            <Button variant="ai" size="md" icon={Plus} className="font-bold shadow-lg">
              Create a Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('find-candidates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'find-candidates' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Find Teammates for My Projects
        </button>
        <button
          onClick={() => setActiveTab('browse-projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'browse-projects' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Browse Projects to Join
        </button>
      </div>

      {activeTab === 'find-candidates' ? (
        ownedProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">You haven't created any projects yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              To find matching teammates using our AI Teammate Matchmaker, you need to create a project first and specify the required skills and roles.
            </p>
            <Link to="/student/projects/create" className="inline-block pt-2">
              <Button variant="primary" size="sm" icon={Plus}>
                Create a Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Your Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-500 w-full sm:w-80"
                >
                  {ownedProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-slate-500">
                AI matches candidates based on your project's description and required skills.
              </div>
            </div>

            {loadingCandidates ? (
              <div className="p-12 text-center text-xs text-slate-400">
                Calculating compatibility match scores...
              </div>
            ) : candidateError ? (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {candidateError}
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
                <Users2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No suitable candidates found yet</h3>
                <p className="text-xs text-slate-400">Try updating your project requirements or check back as more students join.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {candidates.map(cand => (
                  <div
                    key={cand.student.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar src={cand.student.avatar} name={cand.student.name} size="lg" />
                      <div className="space-y-2 min-w-0">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{cand.student.name}</h3>
                          <p className="text-xs text-brand-700 font-semibold">{cand.student.headline || 'Student Builder'}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{cand.student.college} {cand.student.location ? `• ${cand.student.location}` : ''}</p>
                        </div>
                        
                        {cand.student.bio && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {cand.student.bio}
                          </p>
                        )}

                        {/* Candidate Skills */}
                        <div className="flex flex-wrap gap-1">
                          {(cand.student.skills || []).map(sk => {
                            const skillName = typeof sk === 'string' ? sk : sk.name;
                            const isMatched = cand.matchedSkills.some(ms => ms.toLowerCase() === skillName.toLowerCase());
                            return (
                              <span
                                key={skillName}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                                  isMatched
                                    ? 'bg-brand-50 border-brand-200 text-brand-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                {skillName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-stretch md:items-end gap-4 shrink-0 md:border-l md:border-slate-100 md:pl-6 min-w-[200px]">
                      <div className="space-y-1.5 md:text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{cand.matchScore}% Compatibility</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{cand.matchTier} Fit</p>
                      </div>

                      {/* Reasons */}
                      {cand.reasons && cand.reasons.length > 0 && (
                        <ul className="text-[11px] text-slate-500 space-y-1 md:text-right list-none pl-0">
                          {cand.reasons.map((reason, index) => (
                            <li key={index} className="flex items-center md:justify-end gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Button
                        variant="primary"
                        size="xs"
                        icon={MessageSquare}
                        onClick={() => {
                          startConversation({
                            id: cand.student.id,
                            name: cand.student.name,
                            avatar: cand.student.avatar,
                            role: cand.student.headline || 'Student'
                          });
                          navigate('/student/messages');
                        }}
                      >
                        Message Builder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recruiting projects by title, skill, or role..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Domains (All Projects)</option>
                {PROJECT_DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

            </div>
          </div>

          {/* Projects Looking for Teammates Feed */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <Users2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No projects are currently recruiting teammates</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Have an idea or building something exciting? Create a project, specify the roles you need, and publish a recruitment post.
              </p>
              <Link to="/student/projects/create" className="inline-block pt-2">
                <Button variant="primary" size="sm" icon={Plus}>
                  Create a Project & Find Teammates
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map(project => {
                const memberCount = (project.members || []).length;
                const maxCapacity = project.teamCapacity || 4;
                const neededCount = Math.max(0, maxCapacity - memberCount);
                const isOwner = project.ownerId === user?.id;
                const isMember = (project.members || []).some(m => m.id === user?.id);

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3.5">
                      
                      {/* Domain & Status Bar */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                          {project.domain}
                        </span>
                        <Badge variant="success" size="xs">Recruiting</Badge>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 mt-1 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Looking For: Skills & Roles */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Looking For Teammates In:</p>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {(project.requiredSkills || []).map(skill => (
                            <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Team Capacity Tracker */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Team Roster</span>
                          <span className="font-bold text-brand-700">
                            {memberCount} of {maxCapacity} Filled ({neededCount} spot{neededCount !== 1 ? 's' : ''} left)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-600 to-purple-600 rounded-full"
                            style={{ width: `${Math.min(100, (memberCount / maxCapacity) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Project Leader Card */}
                      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                        <Avatar
                          src={project.ownerAvatar}
                          name={project.ownerName}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            Posted by {project.ownerName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {project.ownerCollege || 'Project Lead'} • {formatRelativeTime(project.createdAt)}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link to={`/student/projects/${project.id}`}>
                        <Button variant="secondary" size="xs">
                          View Project
                        </Button>
                      </Link>

                      <div className="flex items-center gap-2">
                        {!isOwner && (
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={MessageSquare}
                            onClick={() => handleDirectMessageLeader(project)}
                          >
                            Message Leader
                          </Button>
                        )}

                        {!isOwner && !isMember && (
                          <Button
                            variant="ai"
                            size="xs"
                            onClick={() => handleOpenInterestModal(project)}
                          >
                            I'm Interested
                          </Button>
                        )}

                        {isOwner && (
                          <Badge variant="brand" size="sm">Your Project</Badge>
                        )}

                        {isMember && !isOwner && (
                          <Badge variant="success" size="sm">Joined Team</Badge>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* "I'm Interested" Modal */}
      {selectedProjForInterest && (
        <Modal
          isOpen={!!selectedProjForInterest}
          onClose={() => setSelectedProjForInterest(null)}
          title={`Express Interest in ${selectedProjForInterest.title}`}
          subtitle={`Lead by ${selectedProjForInterest.ownerName}`}
        >
          {interestSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interest Sent to Project Leader!</h3>
              <p className="text-xs text-slate-500">
                {selectedProjForInterest.ownerName} has received your interest note. You will be notified when they review your profile.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendInterest} className="space-y-4">
              {interestError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {interestError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role You Are Interested In</label>
                <input
                  type="text"
                  value={roleApplied}
                  onChange={(e) => setRoleApplied(e.target.value)}
                  placeholder="e.g. Frontend Developer, Computer Vision Specialist"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Why are you interested in this project? How can you contribute? *
                </label>
                <textarea
                  rows={4}
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  placeholder="I'm interested because I have experience with Python and OpenCV and would like to contribute to the computer vision part..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedProjForInterest(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmittingInterest} icon={Send}>
                  {isSubmittingInterest ? 'Sending...' : 'Send Interest'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};
