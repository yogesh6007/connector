import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Code2,
  Globe,
  Award,
  Briefcase,
  FolderKanban,
  MessageSquare,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OrganizerStudentProfile = () => {
  const { id } = useParams();
  const { students, projects, startConversation } = useApp();
  const navigate = useNavigate();

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-card">
        <p className="text-sm font-bold text-slate-700">Student profile not found or loading...</p>
      </div>
    );
  }

  const studentProjects = projects.filter(p => p.ownerId === student.id || (p.members || []).some(m => m.id === student.id));

  const handleMessage = () => {
    const convId = startConversation({
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      role: student.headline
    });
    navigate('/organizer/messages');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <Link to="/organizer/students" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Directory</span>
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border border-slate-200 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{student.name}</h1>
                <Badge variant="brand" size="sm">Verified Student</Badge>
              </div>
              <p className="text-xs font-bold text-purple-700">{student.headline}</p>
              <p className="text-xs text-slate-500">{student.college} • {student.degree} ({student.gradYear})</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span>{student.location}</span>
                {student.gpa && <span className="text-emerald-700 font-bold">GPA: {student.gpa}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ai" size="md" icon={MessageSquare} onClick={handleMessage}>
              Invite to Interview
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Candidate</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {student.bio}
          </p>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Mastery</h3>
          <div className="space-y-2">
            {(student.skills || []).map(skillObj => {
              const name = typeof skillObj === 'string' ? skillObj : skillObj.name;
              const level = typeof skillObj === 'object' ? skillObj.level : 'Intermediate';
              const endorsed = typeof skillObj === 'object' ? skillObj.endorsed : 12;

              return (
                <div key={name} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{name}</p>
                    <p className="text-[10px] text-purple-700 font-semibold">{level}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {endorsed} Endorsements
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Student Projects ({studentProjects.length})</h3>
          <div className="space-y-3">
            {studentProjects.map(proj => (
              <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{proj.domain}</span>
                <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
