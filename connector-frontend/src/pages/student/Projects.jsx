import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProjectCard from '../../components/cards/ProjectCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { DOMAINS, WORK_MODES } from '../../utils/constants';
import {
  FolderGit2,
  PlusCircle,
  Search,
  Filter,
  Users2,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function Projects() {
  const { projects } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [onlyLooking, setOnlyLooking] = useState(false);

  const filteredProjects = projects.filter((proj) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      proj.title?.toLowerCase().includes(term) ||
      proj.description?.toLowerCase().includes(term) ||
      proj.requiredSkills?.some((s) => s.toLowerCase().includes(term));

    const matchesDomain = selectedDomain === 'All' || proj.domain === selectedDomain;
    const matchesWorkMode = selectedWorkMode === 'All' || proj.workMode === selectedWorkMode;
    const matchesLooking = !onlyLooking || proj.lookingForTeammates;

    return matchesSearch && matchesDomain && matchesWorkMode && matchesLooking;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & New Project CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Collaboration Projects</h1>
          <p className="text-xs text-slate-500">
            Discover real-world student projects, view open technical roles, and join innovative teams
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/projects/my">
            <Button variant="outline" size="sm" icon={FolderGit2}>
              My Projects
            </Button>
          </Link>
          <Link to="/student/projects/create">
            <Button variant="gradient" size="sm" icon={PlusCircle}>
              Create Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, description, or technology (e.g. PyTorch, React)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Domain Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Domains</option>
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Work Modes</option>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Looking for Teammates */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyLooking}
              onChange={(e) => setOnlyLooking(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Only show projects actively recruiting teammates</span>
          </label>

          <span className="text-slate-400 font-medium">{filteredProjects.length} Projects found</span>
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderGit2}
          title="No projects match your criteria"
          description="Try relaxing your domain and search filters or be the first to create a new project in this domain!"
          actionLabel="Create New Project"
          onAction={() => window.location.assign('/student/projects/create')}
        />
      )}
    </div>
  );
}
