import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { OPPORTUNITY_TYPES, POPULAR_SKILLS, WORK_MODES } from '../../utils/constants';
import {
  Briefcase,
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CreateOpportunity = () => {
  const { user } = useAuth();
  const { createOpportunity } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState(OPPORTUNITY_TYPES.INTERNSHIP);
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [duration, setDuration] = useState('12 Weeks (Summer 2026)');
  const [stipend, setStipend] = useState('$9,500 / month + Housing');
  const [positionsCount, setPositionsCount] = useState(3);
  const [deadline, setDeadline] = useState('2026-04-15');

  const [skillsRequired, setSkillsRequired] = useState(['Python', 'React', 'Docker']);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (sk) => {
    if (!sk || skillsRequired.includes(sk)) return;
    setSkillsRequired(prev => [...prev, sk]);
    setSkillInput('');
  };

  const handleRemoveSkill = (sk) => {
    setSkillsRequired(prev => prev.filter(s => s !== sk));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const respList = responsibilitiesText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const reqList = requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const newOpp = createOpportunity({
      title: title.trim(),
      type,
      description: description.trim(),
      responsibilities: respList.length > 0 ? respList : ['Contribute to mission-critical engineering initiatives.', 'Participate in weekly agile syncs.'],
      requirements: reqList.length > 0 ? reqList : ['Active university student status in CS or related STEM field.'],
      location,
      workMode,
      duration,
      stipend,
      positionsCount: parseInt(positionsCount) || 1,
      deadline,
      skillsRequired
    });

    navigate('/organizer/opportunities');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <Link to="/organizer/opportunities" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recruiter Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Publish New Opportunity</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Broadcast internships, hackathons, fellowships, or project grants directly to top university builders on CONNECTOR.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Core Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">1. Listing Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer 2026 Distributed AI Systems Intern"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              >
                {Object.values(OPPORTUNITY_TYPES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity mission, company group, team culture, and learning goals..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Requirements & Responsibilities */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-900">2. Responsibilities & Requirements</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Responsibilities (1 per line)</label>
              <textarea
                rows={4}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Design and optimize low-latency RPC streaming&#10;Collaborate with AI researchers on model training&#10;Present project milestones"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility & Qualifications (1 per line)</label>
              <textarea
                rows={4}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="Pursuing B.S./M.S. in Computer Science&#10;Proficiency in Python or Go&#10;Experience with containerization (Docker)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-base font-bold text-slate-900">3. Target Candidate Skills</h3>
          
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skillsRequired.map(sk => (
              <span key={sk} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-medium">
                {sk}
                <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-brand-400 hover:text-brand-900">
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput.trim());
                }
              }}
              placeholder="Add skill tag (e.g. PyTorch, React, Go)"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => handleAddSkill(skillInput.trim())} icon={Plus}>
              Add
            </Button>
          </div>
        </div>

        {/* Compensation & Logistics */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-900">4. Compensation & Timeline</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stipend / Compensation</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Open Positions Count</label>
              <input
                type="number"
                min="1"
                max="50"
                value={positionsCount}
                onChange={(e) => setPositionsCount(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link to="/organizer/opportunities">
            <Button variant="secondary" size="md">
              Save Draft
            </Button>
          </Link>
          <Button type="submit" variant="ai" size="md" className="font-bold shadow-lg" icon={Sparkles} iconPosition="right">
            Publish Opportunity
          </Button>
        </div>

      </form>

    </div>
  );
};
