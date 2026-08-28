import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import SkillTagInput from '../../components/common/SkillTagInput';
import { OPPORTUNITY_TYPES, WORK_MODES } from '../../utils/constants';
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';

export default function CreateOpportunity() {
  const { currentUser } = useAuth();
  const { createOpportunity, addToast } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Internship');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(['Python', 'Docker', 'Google Cloud']);
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [duration, setDuration] = useState('12 Weeks (Summer 2026)');
  const [stipend, setStipend] = useState('$8,500 / month + Relocation');
  const [eligibility, setEligibility] = useState('Enrolled in undergraduate or master degree program');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [positions, setPositions] = useState(5);

  const [responsibilities, setResponsibilities] = useState([
    'Design, implement, and test core distributed features.',
    'Collaborate with senior engineering mentors on technical design documents.'
  ]);

  const [requirements, setRequirements] = useState([
    'Strong knowledge of algorithms, data structures, and system architecture.',
    'Proficiency in Python, Go, TypeScript, or C++.'
  ]);

  const handleAddResponsibility = () => setResponsibilities([...responsibilities, '']);
  const handleRemoveResponsibility = (index) =>
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  const handleRespChange = (index, val) => {
    const updated = [...responsibilities];
    updated[index] = val;
    setResponsibilities(updated);
  };

  const handleAddRequirement = () => setRequirements([...requirements, '']);
  const handleRemoveRequirement = (index) =>
    setRequirements(requirements.filter((_, i) => i !== index));
  const handleReqChange = (index, val) => {
    const updated = [...requirements];
    updated[index] = val;
    setRequirements(updated);
  };

  const handleSubmit = (status = 'Published') => {
    if (!title.trim() || !description.trim()) {
      addToast('Please enter both opportunity title and description', 'error');
      return;
    }

    createOpportunity({
      title: title.trim(),
      type,
      description: description.trim(),
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      skills,
      location,
      workMode,
      duration,
      stipend,
      eligibility,
      deadline,
      positions: Number(positions),
      status
    });

    navigate('/organizer/opportunities');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post New Opportunity</h1>
        <p className="text-xs text-slate-500">
          Publish internships, research fellowships, competitions, or sponsorships for students
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit('Published'); }} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Opportunity Overview
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Opportunity Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI & Distributed Systems Summer Internship 2026"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              >
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              >
                {WORK_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Objectives *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide an overview of the program, projects candidates will work on, and organizational mission..."
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Skills Required */}
          <SkillTagInput
            selectedSkills={skills}
            onChange={setSkills}
            label="Required Skills & Competencies"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Compensation / Stipend
              </label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. $8,500/mo or $25k Grant"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Responsibilities & Requirements Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Responsibilities */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Key Responsibilities</h3>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                + Add
              </button>
            </div>
            {responsibilities.map((resp, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleRespChange(i, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
                {responsibilities.length > 1 && (
                  <button type="button" onClick={() => handleRemoveResponsibility(i)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Candidate Requirements</h3>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                + Add
              </button>
            </div>
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleReqChange(i, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
                {requirements.length > 1 && (
                  <button type="button" onClick={() => handleRemoveRequirement(i)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit('Draft')}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Publish Opportunity
          </Button>
        </div>
      </form>
    </div>
  );
}
