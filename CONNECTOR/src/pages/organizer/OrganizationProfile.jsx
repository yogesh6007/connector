import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  FolderKanban,
  Edit3,
  Users2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Plus,
  Camera,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';

export const OrganizationProfile = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { opportunities, projects, fetchOpportunities } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || user?.organizationName || '');
  const [tagline, setTagline] = useState(user?.tagline || '');
  const [description, setDescription] = useState(user?.description || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [location, setLocation] = useState(user?.location || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [orgType, setOrgType] = useState(user?.orgType || '');
  const [size, setSize] = useState(user?.size || '');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || user?.organizationName || '');
      setTagline(user.tagline || '');
      setDescription(user.description || '');
      setWebsite(user.website || '');
      setLocation(user.location || '');
      setIndustry(user.industry || '');
      setOrgType(user.orgType || '');
      setSize(user.size || '');
    }
  }, [user]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const myOpportunities = opportunities.filter(
    o => o.orgId === user?.id || o.orgName === user?.name
  );

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateAvatar(reader.result);
      } catch (err) {
        console.error('Failed to upload logo:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        organizationName: name,
        tagline,
        description,
        website,
        location,
        industry,
        orgType,
        size
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error saving organization profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Organization Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Cover Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-900 relative">
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="xs"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md"
              icon={Edit3}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Brand Profile
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Logo with Upload */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                <Avatar
                  src={user?.logo || user?.avatar}
                  name={user?.name || user?.organizationName || 'Org'}
                  size="3xl"
                  className="w-full h-full rounded-none"
                />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer border-4 border-white"
                title="Upload Logo"
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
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" size="sm" icon={Edit3} onClick={() => setIsEditModalOpen(true)}>
                Edit Brand Profile
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user?.name || user?.organizationName || 'Organization Name'}</h1>
                <Badge variant="brand" size="sm" icon={ShieldCheck}>Verified Organization</Badge>
              </div>
              <p className="text-sm font-semibold text-purple-800 mt-1">
                {user?.tagline || 'Add a company tagline'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              {user?.industry && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  {user.industry} {user.orgType ? `(${user.orgType})` : ''}
                </span>
              )}
              {user?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {user.location}
                </span>
              )}
              {user?.size && <span>{user.size}</span>}
            </div>

            {user?.website && (
              <div className="pt-2">
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{user.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mission & About</h3>
            {user?.description ? (
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {user.description}
              </p>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">No mission description added yet.</p>
                <Button variant="secondary" size="xs" onClick={() => setIsEditModalOpen(true)}>
                  + Add Mission Statement
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Open Listings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span>Active Published Listings ({myOpportunities.length})</span>
              </h3>
              <Link to="/organizer/opportunities/create">
                <Button variant="secondary" size="xs" icon={Plus}>
                  New Listing
                </Button>
              </Link>
            </div>

            {myOpportunities.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No active listings published</h4>
                  <p className="text-[11px] text-slate-500">Publish fellowships, internships, or project bounties to recruit student talent.</p>
                </div>
                <Link to="/organizer/opportunities/create">
                  <Button variant="primary" size="xs" icon={Plus}>
                    Publish First Opportunity
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myOpportunities.map(opp => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{opp.type}</span>
                      <Badge variant="success" size="xs">Active</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{opp.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{opp.description}</p>
                    <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                      <span>{opp.applicantsCount || 0} Applicants</span>
                      <Link to="/organizer/applicants" className="font-bold text-brand-600">
                        Review Applicants →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization Profile"
        subtitle="Update public brand details, mission statement, and location"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Next-Generation AI Research Lab"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Mission</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organization's mission and team culture..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Artificial Intelligence"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 50-200 employees"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
