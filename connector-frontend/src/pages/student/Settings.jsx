import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Repeat,
  Lock,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function Settings() {
  const { currentUser, switchRole, logout } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [opportunityAlerts, setOpportunityAlerts] = useState(true);
  const [privacyVisible, setPrivacyVisible] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your notification preferences, privacy visibility, and system configurations
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notification Preferences
          </h2>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">AI Teammate Match Alerts</p>
                <p className="text-[11px] text-slate-500">Receive instant alerts when a high-compatibility teammate creates a relevant project.</p>
              </div>
              <input
                type="checkbox"
                checked={matchAlerts}
                onChange={(e) => setMatchAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">New Opportunity Notifications</p>
                <p className="text-[11px] text-slate-500">Get notified when grants or internships matching your skills are published.</p>
              </div>
              <input
                type="checkbox"
                checked={opportunityAlerts}
                onChange={(e) => setOpportunityAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Email Digest</p>
                <p className="text-[11px] text-slate-500">Weekly summary of network activity and new mentorship slots.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Privacy & Discovery */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Privacy & Profile Visibility
          </h2>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Include Profile in AI Teammate Recommendations</p>
              <p className="text-[11px] text-slate-500">Allow other student creators and organizers to discover your portfolio for collaborations.</p>
            </div>
            <input
              type="checkbox"
              checked={privacyVisible}
              onChange={(e) => setPrivacyVisible(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        {/* Fast Role Switch Testing */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-purple-600" />
            Role & Persona Switching
          </h2>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-purple-950">Switch to Organizer Mode</p>
              <p className="text-[11px] text-purple-700">Preview the recruiter dashboard, post opportunities, review applicants, and sponsor projects.</p>
            </div>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              icon={Repeat}
              onClick={() => {
                switchRole('organizer');
                navigate('/organizer/dashboard');
              }}
            >
              Switch Role
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="gradient" size="md">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
