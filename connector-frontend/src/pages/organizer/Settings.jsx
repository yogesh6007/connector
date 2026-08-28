import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import {
  Settings as SettingsIcon,
  Bell,
  Building2,
  Repeat,
  Shield,
  Lock
} from 'lucide-react';

export default function OrganizerSettings() {
  const { switchRole } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [applicantAlerts, setApplicantAlerts] = useState(true);
  const [mentorshipAlerts, setMentorshipAlerts] = useState(true);
  const [digestEmail, setDigestEmail] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Organizer settings updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organizer Settings</h1>
        <p className="text-xs text-slate-500">
          Manage candidate notifications, recruitment pipeline preferences, and account controls
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Applicant & Candidate Alerts
          </h2>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">New Applicant Alert</p>
                <p className="text-[11px] text-slate-500">Receive instant alerts when a student submits an application for your opportunities.</p>
              </div>
              <input
                type="checkbox"
                checked={applicantAlerts}
                onChange={(e) => setApplicantAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Student Mentorship Inquiries</p>
                <p className="text-[11px] text-slate-500">Get notified when students request advisory sessions on technical projects.</p>
              </div>
              <input
                type="checkbox"
                checked={mentorshipAlerts}
                onChange={(e) => setMentorshipAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900">Weekly Talent Digest</p>
                <p className="text-[11px] text-slate-500">Summary of top-ranked student capstone projects and hackathon winners.</p>
              </div>
              <input
                type="checkbox"
                checked={digestEmail}
                onChange={(e) => setDigestEmail(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-indigo-600" />
            Switch to Student Persona
          </h2>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-950">Switch to Student Experience</p>
              <p className="text-[11px] text-indigo-700">Experience CONNECTOR from a student's perspective: create projects, match with teammates, and apply for grants.</p>
            </div>
            <Button
              type="button"
              variant="gradient"
              size="sm"
              icon={Repeat}
              onClick={() => {
                switchRole('student');
                navigate('/student/dashboard');
              }}
            >
              Switch to Student
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
