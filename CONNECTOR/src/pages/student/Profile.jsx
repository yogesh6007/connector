import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { userService } from '../../services/userService';
import {
  User,
  MapPin,
  GraduationCap,
  Sparkles,
  Code2,
  Globe,
  Award,
  Briefcase,
  FolderKanban,
  Edit3,
  CheckCircle2,
  Share2,
  Plus,
  Trash2,
  Camera,
  Upload,
  ExternalLink,
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import { PostCard } from '../../components/feed/PostCard';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatar } = useAuth();
  const { projects, posts, fetchFeed, fetchMyProjects, startConversation } = useApp();

  const isOwnProfile = !id || id === user?.id;

  const [viewedUser, setViewedUser] = useState(null);
  const [loadingViewed, setLoadingViewed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none' | 'pending_sent' | 'pending_received' | 'connected'
  const [connectionRequestId, setConnectionRequestId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Core Form State
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [gradYear, setGradYear] = useState(user?.gradYear || '');
  const [location, setLocation] = useState(user?.location || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');

  // Skills & Interests
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState(user?.interests || []);
  const [interestInput, setInterestInput] = useState('');

  // Experience & Education
  const [experienceList, setExperienceList] = useState(user?.experience || []);
  const [educationList, setEducationList] = useState(user?.education || []);

  // Experience Form
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Education Form
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');

  const fileInputRef = useRef(null);

  // Fetch viewed user details and connection status
  useEffect(() => {
    if (!isOwnProfile && id) {
      setLoadingViewed(true);
      const fetchProfileData = async () => {
        try {
          const profile = await userService.getUserById(id);
          setViewedUser(profile);
          
          const conn = await userService.getConnectionStatus(id);
          setConnectionStatus(conn.status);
          setConnectionRequestId(conn.requestId);
        } catch (err) {
          console.error('Error fetching student profile:', err);
        } finally {
          setLoadingViewed(false);
        }
      };
      fetchProfileData();
    } else {
      setViewedUser(null);
    }
  }, [id, isOwnProfile]);

  // Sync state when user profile updates
  useEffect(() => {
    const targetUser = isOwnProfile ? user : viewedUser;
    if (targetUser) {
      setName(targetUser.name || '');
      setHeadline(targetUser.headline || '');
      setBio(targetUser.bio || '');
      setCollege(targetUser.college || '');
      setDegree(targetUser.degree || '');
      setGradYear(targetUser.gradYear || '');
      setLocation(targetUser.location || '');
      setGithub(targetUser.github || '');
      setLinkedin(targetUser.linkedin || '');
      setPortfolio(targetUser.portfolio || '');
      setResumeUrl(targetUser.resumeUrl || '');
      setSkills(targetUser.skills || []);
      setInterests(targetUser.interests || []);
      setExperienceList(targetUser.experience || []);
      setEducationList(targetUser.education || []);
    }
  }, [user, viewedUser, isOwnProfile]);

  // Load user's real projects and posts
  useEffect(() => {
    fetchMyProjects();
    fetchFeed();
  }, [fetchMyProjects, fetchFeed]);

  const profileUser = isOwnProfile ? user : viewedUser;

  const myProjects = projects.filter(
    p => p.ownerId === profileUser?.id || (p.members || []).some(m => m.id === profileUser?.id)
  );

  const myPosts = posts.filter(p => p.authorId === profileUser?.id);

  const handleSendConnection = async () => {
    try {
      await userService.sendConnectionRequest(id);
      setConnectionStatus('pending_sent');
    } catch (e) {
      console.error('Error sending connection request:', e);
    }
  };

  const handleAcceptConnection = async () => {
    try {
      if (connectionRequestId) {
        await userService.acceptConnectionRequest(connectionRequestId);
        setConnectionStatus('connected');
      } else {
        const reqs = await userService.getPendingConnectionRequests();
        const req = reqs.find(r => r.senderId === id);
        if (req) {
          await userService.acceptConnectionRequest(req.id);
          setConnectionStatus('connected');
        }
      }
    } catch (e) {
      console.error('Error accepting connection request:', e);
    }
  };

  const handleRejectConnection = async () => {
    try {
      if (connectionRequestId) {
        await userService.rejectConnectionRequest(connectionRequestId);
        setConnectionStatus('none');
      } else {
        const reqs = await userService.getPendingConnectionRequests();
        const req = reqs.find(r => r.senderId === id);
        if (req) {
          await userService.rejectConnectionRequest(req.id);
          setConnectionStatus('none');
        }
      }
    } catch (e) {
      console.error('Error ignoring connection request:', e);
    }
  };

  const handleDisconnect = async () => {
    try {
      await userService.disconnectConnection(id);
      setConnectionStatus('none');
      setConnectionRequestId(null);
    } catch (e) {
      console.error('Error disconnecting:', e);
    }
  };

  const handleStartChat = () => {
    if (profileUser) {
      startConversation({
        id: profileUser.id,
        name: profileUser.name,
        avatar: profileUser.avatar,
        role: profileUser.headline || 'Student'
      });
      navigate('/student/messages');
    }
  };

  // Dynamic Profile Completion Calculation
  const calculateProfileCompletion = () => {
    let score = 0;
    if (user?.name) score += 10;
    if (user?.headline) score += 15;
    if (user?.bio) score += 15;
    if (user?.college || user?.degree) score += 15;
    if (user?.avatar) score += 10;
    if (user?.skills && user.skills.length > 0) score += 15;
    if (user?.experience && user.experience.length > 0) score += 10;
    if (user?.github || user?.linkedin || user?.portfolio || user?.resumeUrl) score += 10;
    return Math.min(100, score);
  };

  const completionPercentage = calculateProfileCompletion();

  // Avatar Upload Handler (FileReader -> base64 Data URL)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        await updateAvatar(base64Data);
      } catch (err) {
        console.error('Failed to upload avatar:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Skill Add / Remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const exists = skills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === skillInput.trim().toLowerCase());
    if (!exists) {
      const updated = [...skills, { name: skillInput.trim(), level: 'Intermediate', endorsed: 0 }];
      setSkills(updated);
      updateProfile({ skills: updated });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillNameToRemove) => {
    const updated = skills.filter(s => (typeof s === 'string' ? s : s.name) !== skillNameToRemove);
    setSkills(updated);
    updateProfile({ skills: updated });
  };

  // Interest Add / Remove
  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    if (!interests.includes(interestInput.trim())) {
      const updated = [...interests, interestInput.trim()];
      setInterests(updated);
      updateProfile({ interests: updated });
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updated = interests.filter(i => i !== interestToRemove);
    setInterests(updated);
    updateProfile({ interests: updated });
  };

  // Save General Profile Modal
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        headline,
        bio,
        college,
        degree,
        gradYear: gradYear ? parseInt(gradYear) : null,
        location,
        github,
        linkedin,
        portfolio,
        resumeUrl
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Experience
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!expRole || !expCompany) return;
    const newExp = {
      id: `exp-${Date.now()}`,
      role: expRole.trim(),
      company: expCompany.trim(),
      period: expPeriod.trim() || 'Present',
      description: expDesc.trim()
    };
    const updated = [...experienceList, newExp];
    setExperienceList(updated);
    await updateProfile({ experience: updated });
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDesc('');
    setIsExpModalOpen(false);
  };

  const handleDeleteExperience = async (expId) => {
    const updated = experienceList.filter(e => e.id !== expId);
    setExperienceList(updated);
    await updateProfile({ experience: updated });
  };

  // Add Education
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    if (!eduInstitution) return;
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: eduInstitution.trim(),
      degree: eduDegree.trim(),
      period: eduPeriod.trim()
    };
    const updated = [...educationList, newEdu];
    setEducationList(updated);
    await updateProfile({ education: updated });
    setEduInstitution('');
    setEduDegree('');
    setEduPeriod('');
    setIsEduModalOpen(false);
  };

  const handleDeleteEducation = async (eduId) => {
    const updated = educationList.filter(e => e.id !== eduId);
    setEducationList(updated);
    await updateProfile({ education: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Cover Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 relative">
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="xs"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md"
                icon={Edit3}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar with Upload Overlay */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                <Avatar
                  src={profileUser?.avatar}
                  name={profileUser?.name || 'User'}
                  size="3xl"
                  className="w-full h-full rounded-none"
                />
              </div>

              {/* Upload Overlay */}
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-3xl bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer border-4 border-white"
                    title="Upload Profile Picture"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Change</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {connectionStatus === 'none' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendConnection}
                    >
                      Connect
                    </Button>
                  )}
                  {connectionStatus === 'pending_sent' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                    >
                      Pending
                    </Button>
                  )}
                  {connectionStatus === 'pending_received' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAcceptConnection}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleRejectConnection}
                      >
                        Ignore
                      </Button>
                    </>
                  )}
                  {connectionStatus === 'connected' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleStartChat}
                  >
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{profileUser?.name || 'Your Name'}</h1>
                <Badge variant="brand" size="sm">Verified Student</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profileUser?.headline || 'Add a professional headline (e.g. CS Student @ Stanford)'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              {profileUser?.college && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  {profileUser.college} {profileUser?.gradYear ? `(${profileUser.gradYear})` : ''}
                </span>
              )}
              {profileUser?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profileUser.location}
                </span>
              )}
            </div>

            {/* External Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {profileUser?.github && (
                <a href={profileUser.github} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-700 hover:text-brand-600 flex items-center gap-1 font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profileUser?.linkedin && (
                <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profileUser?.portfolio && (
                <a href={profileUser.portfolio} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portfolio Site</span>
                </a>
              )}
              {profileUser?.resumeUrl && (
                <a href={profileUser.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Resume</span>
                </a>
              )}
            </div>

            {/* Profile Completion Meter */}
            {isOwnProfile && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Profile Completion
                  </span>
                  <span className="font-black text-brand-600">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-purple-600 transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Grid: Left 5 Cols, Right 7 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* About / Bio */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About & Bio</h3>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  Edit
                </button>
              )}
            </div>
            {bio ? (
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">No bio added yet.</p>
                {isOwnProfile && (
                  <Button variant="secondary" size="xs" onClick={() => setIsEditModalOpen(true)}>
                    + Add About Section
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verified Skills</h3>
              <span className="text-xs font-bold text-brand-600">{skills.length} Skills</span>
            </div>

            {isOwnProfile && (
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill (e.g. React, Python)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" variant="secondary" size="xs" icon={Plus}>
                  Add
                </Button>
              </form>
            )}

            {skills.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No technical skills added yet.
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map(sk => {
                  const name = typeof sk === 'string' ? sk : sk.name;
                  const level = typeof sk === 'object' ? sk.level : 'Intermediate';

                  return (
                    <div key={name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{name}</p>
                        <p className="text-[10px] text-brand-600 font-semibold">{level}</p>
                      </div>
                      {isOwnProfile && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(name)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Interests & Domains</h3>
              <span className="text-xs font-bold text-purple-600">{interests.length} Interests</span>
            </div>

            {isOwnProfile && (
              <form onSubmit={handleAddInterest} className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add domain (e.g. AI/ML, Robotics)"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                />
                <Button type="submit" variant="secondary" size="xs" icon={Plus}>
                  Add
                </Button>
              </form>
            )}

            {interests.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No interests added yet.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {interests.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-medium"
                  >
                    <span>{item}</span>
                    {isOwnProfile && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(item)}
                        className="text-purple-400 hover:text-purple-900 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Projects, Experience, Education, Posts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Projects Showcase */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-brand-600" />
                <span>Projects ({myProjects.length})</span>
              </h3>
              {isOwnProfile && (
                <Link to="/student/projects/create">
                  <Button variant="secondary" size="xs" icon={Plus}>
                    New Project
                  </Button>
                </Link>
              )}
            </div>

            {myProjects.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                <FolderKanban className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No projects added yet</h4>
                  <p className="text-[11px] text-slate-500">Collaborative projects will showcase here.</p>
                </div>
                {isOwnProfile && (
                  <Link to="/student/projects/create">
                    <Button variant="primary" size="xs" icon={Plus}>
                      Create Your First Project
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {myProjects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{proj.domain}</span>
                      <Badge variant="brand" size="xs">{proj.status}</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400">Team: {proj.members?.length || 1} / {proj.teamCapacity || 4}</span>
                      <Link to={`/student/projects/${proj.id}`} className="font-bold text-brand-600 hover:text-brand-700">
                        View Project Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Experience & Internships</span>
              </h3>
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  size="xs"
                  icon={Plus}
                  onClick={() => setIsExpModalOpen(true)}
                >
                  Add Experience
                </Button>
              )}
            </div>

            {experienceList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">No experience entries added yet.</p>
                {isOwnProfile && (
                  <Button variant="secondary" size="xs" onClick={() => setIsExpModalOpen(true)}>
                    + Add Your Experience
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {experienceList.map(exp => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 relative group">
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                    <p className="text-xs font-semibold text-brand-700">{exp.company} • {exp.period}</p>
                    {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Education</span>
              </h3>
              {isOwnProfile && (
                <Button
                  variant="secondary"
                  size="xs"
                  icon={Plus}
                  onClick={() => setIsEduModalOpen(true)}
                >
                  Add Education
                </Button>
              )}
            </div>

            {educationList.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">No education entries added yet.</p>
                {isOwnProfile && (
                  <Button variant="secondary" size="xs" onClick={() => setIsEduModalOpen(true)}>
                    + Add Your University
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {educationList.map(edu => (
                  <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 relative group">
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete education"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{edu.institution}</h4>
                    <p className="text-xs text-purple-700 font-semibold">{edu.degree} {edu.period ? `• ${edu.period}` : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Created Posts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Posts & Updates ({myPosts.length})</h3>
            {myPosts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  {isOwnProfile ? "You haven't posted anything yet." : "This student hasn't posted anything yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/student/feed">
                    <Button variant="secondary" size="xs">
                      Create Your First Post
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              myPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>

        </div>

      </div>

      {/* Edit Main Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Professional Profile"
        subtitle="Update your name, headline, biography, and university details"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. AI Systems Builder @ Stanford"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">About & Vision</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students and recruiters about your engineering journey, interests, and goals..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Stanford University"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Major</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="B.S. Computer Science"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio Site URL</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resume / CV Link</label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      {isExpModalOpen && (
        <Modal
          isOpen={isExpModalOpen}
          onClose={() => setIsExpModalOpen(false)}
          title="Add Work Experience"
          subtitle="Add an internship, research role, or work experience"
        >
          <form onSubmit={handleSaveExperience} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Job Title *</label>
              <input
                type="text"
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                placeholder="e.g. Frontend Engineering Intern"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="e.g. Google, MIT Media Lab"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timeframe / Period</label>
                <input
                  type="text"
                  value={expPeriod}
                  onChange={(e) => setExpPeriod(e.target.value)}
                  placeholder="e.g. Summer 2025"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Contributions</label>
              <textarea
                rows={3}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Key accomplishments, technologies used..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" type="button" onClick={() => setIsExpModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Add Experience
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Education Modal */}
      {isEduModalOpen && (
        <Modal
          isOpen={isEduModalOpen}
          onClose={() => setIsEduModalOpen(false)}
          title="Add Education"
          subtitle="Add university, degree, or specialization"
        >
          <form onSubmit={handleSaveEducation} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name *</label>
              <input
                type="text"
                value={eduInstitution}
                onChange={(e) => setEduInstitution(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="e.g. B.S. Computer Science"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Period</label>
                <input
                  type="text"
                  value={eduPeriod}
                  onChange={(e) => setEduPeriod(e.target.value)}
                  placeholder="e.g. Class of 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" type="button" onClick={() => setIsEduModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Add Education
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
