import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import OpportunityCard from '../../components/cards/OpportunityCard';
import ProjectCard from '../../components/cards/ProjectCard';
import Tabs from '../../components/common/Tabs';
import {
  Building2,
  MapPin,
  Mail,
  Globe,
  Edit3,
  Briefcase,
  FolderGit2,
  Users,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OrganizationProfile() {
  const { currentUser, updateProfile } = useAuth();
  const { opportunities, projects, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('opportunities');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(currentUser.name || '');
  const [editType, setEditType] = useState(currentUser.type || '');
  const [editIndustry, setEditIndustry] = useState(currentUser.industry || '');
  const [editLocation, setEditLocation] = useState(currentUser.location || '');
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editDescription, setEditDescription] = useState(currentUser.description || '');

  const myOpportunities = opportunities.filter(
    (o) => o.organization?.id === currentUser.id || o.organization?.name === currentUser.name
  );
  const displayOpps = myOpportunities.length > 0 ? myOpportunities : opportunities.slice(0, 2);
  const sponsoredProjects = projects.slice(0, 2);

  const profileTabs = [
    { id: 'opportunities', label: `Active Opportunities (${displayOpps.length})`, icon: Briefcase },
    { id: 'sponsored', label: `Supported Projects (${sponsoredProjects.length})`, icon: FolderGit2 }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      type: editType,
      industry: editIndustry,
      location: editLocation,
      website: editWebsite,
      description: editDescription
    });
    setIsEditModalOpen(false);
    addToast('Organization profile updated!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header Banner & Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-44 sm:h-52 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 relative">
          {currentUser.banner && (
            <img
              src={currentUser.banner}
              alt="Banner"
              className="w-full h-full object-cover opacity-40"
            />
          )}
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <Avatar
              src={currentUser.logo || currentUser.avatar}
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
              Edit Organization Profile
            </Button>
          </div>

          {/* Info Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentUser.name}</h1>
                <Badge variant="primary" size="xs">Verified Organizer</Badge>
              </div>
              <p className="text-sm font-semibold text-purple-700 mt-0.5">
                {currentUser.type} • {currentUser.industry}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentUser.location || 'San Francisco, CA'}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser.officialEmail || 'partnerships@nexaresearch.ai'}
              </span>
              {currentUser.website && (
                <a
                  href={currentUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-purple-700 font-semibold hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentUser.website.replace('https://', '')}</span>
                </a>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl pt-1">
              {currentUser.description}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-lg font-black text-slate-900">{displayOpps.length}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Opportunities</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-lg font-black text-slate-900">{currentUser.mentoredProjectsCount || 12}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Mentored Teams</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-lg font-black text-slate-900">{currentUser.followersCount || 3420}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Contents */}
      {activeTab === 'opportunities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}

      {activeTab === 'sponsored' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsoredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization Profile"
        subtitle="Update company information, industry focus, and student programs description."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organization Name
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
                Organization Type
              </label>
              <input
                type="text"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Industry
              </label>
              <input
                type="text"
                value={editIndustry}
                onChange={(e) => setEditIndustry(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Website
            </label>
            <input
              type="url"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Student Initiatives
            </label>
            <textarea
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
            />
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
