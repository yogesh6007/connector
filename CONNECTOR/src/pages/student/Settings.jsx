import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, Bell, Lock, Shield, RotateCcw, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Settings = () => {
  const { user } = useAuth();
  const { resetData } = useApp();

  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsPush, setNotificationsPush] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all application data? This will clear all records from the database.')) {
      resetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Account Preferences</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your notification triggers, privacy preferences, and test environment state.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Notifications Config */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" />
            <span>Notification Triggers</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Team Join Requests</p>
                <p className="text-[11px] text-slate-500">Receive instant alerts when a student requests to join your project.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsPush}
                onChange={(e) => setNotificationsPush(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Opportunity Status Updates</p>
                <p className="text-[11px] text-slate-500">Get notified when a recruiter shortlists your application.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Application State Control */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Application Data Store</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All your actions (creating projects, liking posts, applying, messaging, connections) are stored on the server database. You can trigger a clean database reset.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleResetData}
            icon={RotateCcw}
          >
            {resetSuccess ? 'Data Reset Successful!' : 'Reset Application Data'}
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Preferences Saved</span>
            </span>
          )}
          <Button type="submit" variant="primary" size="md" className="font-bold">
            Save Settings
          </Button>
        </div>

      </form>

    </div>
  );
};
