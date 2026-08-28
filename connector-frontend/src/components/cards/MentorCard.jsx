import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import {
  GraduationCap,
  Building,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function MentorCard({ mentor }) {
  const { isStudent } = useAuth();
  const { requestMentorship, startConversation, mentorshipRequests } = useApp();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const hasRequested = mentorshipRequests.some(
    (r) => r.mentorId === mentor.id
  );

  const handleSendRequest = (e) => {
    e.preventDefault();
    requestMentorship(mentor, message.trim() || 'Hello! I would love your guidance on our student project.');
    setIsModalOpen(false);
    setMessage('');
  };

  const handleMessage = () => {
    startConversation(mentor);
    navigate('/student/messages');
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group">
        <div>
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar src={mentor.avatar} name={mentor.name} size="lg" />
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                {mentor.name}
              </h3>
              <p className="text-xs text-slate-600 font-semibold">{mentor.position}</p>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-indigo-600 font-medium">
                <Building className="w-3.5 h-3.5" />
                <span>{mentor.organization}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {mentor.bio}
          </p>

          {/* Expertise */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(mentor.expertise || []).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Availability */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-medium mb-4">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{mentor.availability}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={MessageSquare}
            onClick={handleMessage}
          >
            Message
          </Button>

          {isStudent && (
            <Button
              variant={hasRequested ? 'secondary' : 'gradient'}
              size="sm"
              disabled={hasRequested}
              onClick={() => setIsModalOpen(true)}
              icon={Sparkles}
            >
              {hasRequested ? 'Requested' : 'Request Mentorship'}
            </Button>
          )}
        </div>
      </div>

      {/* Mentorship Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Request Mentorship with ${mentor.name}`}
        subtitle={`${mentor.position} at ${mentor.organization}`}
      >
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 leading-relaxed">
            💡 Mentors donate their time to guide student projects, provide architectural reviews, and advise on career directions.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              What would you like guidance on? *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, your project, and the specific questions or domain challenges you want advice on..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" icon={Send} iconPosition="right">
              Send Mentorship Request
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
