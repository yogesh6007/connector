import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  HeartHandshake,
  MessageSquare,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function OrganizerMentorship() {
  const { mentorshipRequests, handleMentorshipRequest, startConversation } = useApp();
  const navigate = useNavigate();

  const handleMessage = (req) => {
    startConversation({
      id: req.studentId,
      name: req.studentName,
      avatar: req.studentAvatar,
      headline: req.studentHeadline
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mentorship Program Management</h1>
        <p className="text-xs text-slate-500">
          Review incoming student mentorship inquiries, approve advisory sessions, and guide future engineers
        </p>
      </div>

      {/* Mentorship Requests */}
      {mentorshipRequests.length > 0 ? (
        <div className="space-y-4">
          {mentorshipRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3.5">
                  <Avatar src={req.studentAvatar} name={req.studentName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{req.studentName}</h3>
                      <Badge variant={req.status === 'Accepted' ? 'success' : 'default'} size="xs">
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{req.studentHeadline}</p>
                    <span className="text-[10px] text-slate-400">
                      Requested {formatDate(req.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <Button
                    size="xs"
                    variant="outline"
                    icon={MessageSquare}
                    onClick={() => handleMessage(req)}
                  >
                    Chat
                  </Button>

                  {req.status !== 'Accepted' && (
                    <Button
                      size="xs"
                      variant="success"
                      icon={Check}
                      onClick={() => handleMentorshipRequest(req.id, 'Accepted')}
                    >
                      Approve Session
                    </Button>
                  )}

                  {req.status !== 'Rejected' && (
                    <Button
                      size="xs"
                      variant="danger"
                      icon={X}
                      onClick={() => handleMentorshipRequest(req.id, 'Declined')}
                    >
                      Decline
                    </Button>
                  )}
                </div>
              </div>

              {/* Inquiry Note */}
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 text-xs text-slate-700 leading-relaxed italic">
                "{req.message}"
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HeartHandshake}
          title="No mentorship requests yet"
          description="Student inquiries for technical reviews and advisory sessions will appear here."
        />
      )}
    </div>
  );
}
