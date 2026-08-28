import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AiMatchBadge from '../../components/ai/AiMatchBadge';
import {
  GraduationCap,
  MapPin,
  Mail,
  Globe,
  Award,
  Briefcase,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Send
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/BrandIcons';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, startConversation, opportunities, addToast } = useApp();

  const student = students.find((s) => s.id === id) || students[0];

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [offerNote, setOfferNote] = useState('');

  const handleMessage = () => {
    startConversation(student);
    navigate('/organizer/messages');
  };

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!selectedOppId) {
      addToast('Please choose an opportunity', 'error');
      return;
    }
    const opp = opportunities.find((o) => o.id === selectedOppId);
    addToast(`Direct outreach invitation sent to ${student.name} for "${opp?.title}"!`, 'success');
    setIsOfferModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <Link
        to="/organizer/students"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Talent Directory</span>
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <Avatar src={student.avatar} name={student.name} size="2xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{student.name}</h1>
                <AiMatchBadge score={student.id === 'student-2' ? 96 : 92} size="xs" />
              </div>
              <p className="text-sm font-semibold text-slate-600">{student.headline}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-purple-700 font-bold">
                  <GraduationCap className="w-4 h-4" />
                  {student.university} ({student.gradYear || '2026'})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {student.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-start">
            <Button variant="outline" size="sm" icon={MessageSquare} onClick={handleMessage}>
              Message
            </Button>
            <Button
              variant="gradient"
              size="sm"
              icon={Sparkles}
              onClick={() => setIsOfferModalOpen(true)}
            >
              Offer Opportunity
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Bio</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{student.bio}</p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Technical Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {(student.skills || []).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        {student.experience && student.experience.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Work & Research Experience</h2>
            <div className="space-y-2.5">
              {student.experience.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{exp.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-purple-700">{exp.organization}</p>
                  <p className="text-xs text-slate-600 pt-0.5">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Offer Opportunity Modal */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title={`Invite ${student.name} to Apply`}
        subtitle="Select the fellowship, internship, or grant opportunity to share with this candidate."
      >
        <form onSubmit={handleSendOffer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Opportunity *
            </label>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              required
            >
              <option value="">Choose an active opportunity...</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Personalized Recruiter Note
            </label>
            <textarea
              rows={4}
              value={offerNote}
              onChange={(e) => setOfferNote(e.target.value)}
              placeholder={`Hi ${student.name}, our technical team loved your project track record in ${student.skills?.[0] || 'AI'} and we would love to invite you to interview for this position.`}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsOfferModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
              Send Direct Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
