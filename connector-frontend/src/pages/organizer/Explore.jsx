import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Tabs from '../../components/common/Tabs';
import TeammateCard from '../../components/cards/TeammateCard';
import ProjectCard from '../../components/cards/ProjectCard';
import EmptyState from '../../components/common/EmptyState';
import { Search, GraduationCap, FolderGit2 } from 'lucide-react';

export default function OrganizerExplore() {
  const { students, projects } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const term = searchTerm.toLowerCase().trim();

  const matchingStudents = students.filter(
    (s) =>
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.university?.toLowerCase().includes(term) ||
      s.skills?.some((sk) => sk.toLowerCase().includes(term))
  );

  const matchingProjects = projects.filter(
    (p) =>
      !term ||
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.requiredSkills?.some((sk) => sk.toLowerCase().includes(term))
  );

  const tabs = [
    { id: 'students', label: 'Talent & Students', count: matchingStudents.length, icon: GraduationCap },
    { id: 'projects', label: 'Student Projects', count: matchingProjects.length, icon: FolderGit2 }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover Students & Projects</h1>
        <p className="text-xs text-slate-500">
          Source top engineering candidates and explore capstone projects for mentorship or sponsorship
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name, university, skills (e.g. Python, PyTorch, React)..."
          className="w-full pl-12 pr-4 py-3 bg-white text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 shadow-xs focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingStudents.map((st) => (
            <TeammateCard key={st.id} student={st} />
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchingProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
