import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PROJECT_DOMAINS } from '../../utils/constants';
import {
  FolderKanban,
  Sparkles,
  Search,
  Plus,
  Users2,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const Projects = () => {
  const { projects } = useApp();

  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    if (selectedDomain !== 'all' && project.domain !== selectedDomain) return false;
    if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = project.title?.toLowerCase().includes(q);
      const matchDesc = project.description?.toLowerCase().includes(q);
      const matchSkills = (project.requiredSkills || []).some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FolderKanban className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Collaborative Workspaces</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Project Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover real projects with open vacancies and request to join the engineering team.
          </p>
        </div>

        <Link to="/student/projects/create">
          <Button variant="ai" size="md" icon={Plus} className="font-bold shadow-md">
            Create Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, skill..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Project Domains</option>
            {PROJECT_DOMAINS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Project Statuses</option>
            <option value="Recruiting">Recruiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Create a project and start building your team with fellow student builders.
          </p>
          <Link to="/student/projects/create" className="inline-block pt-2">
            <Button variant="primary" size="sm" icon={Plus}>
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(project => {
            const memberCount = (project.members || []).length;
            const maxCapacity = project.teamCapacity || 4;
            const vacancyCount = (project.vacancies || []).length;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-elevated transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Domain and Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                      {project.domain}
                    </span>
                    <Badge variant={project.status === 'Recruiting' ? 'success' : 'brand'} size="xs">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Title and Tagline */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {project.tagline || project.description}
                    </p>
                  </div>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-1">
                    {(project.requiredSkills || []).slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {skill}
                      </span>
                    ))}
                    {(project.requiredSkills || []).length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-semibold">
                        +{project.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Team Capacity Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Team Capacity</span>
                      <span className="font-bold text-slate-900">{memberCount} of {maxCapacity} Filled</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: `${Math.min(100, (memberCount / maxCapacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Lead: <strong>{project.ownerName}</strong></span>
                  </div>

                  <Link to={`/student/projects/${project.id}`}>
                    <Button variant="secondary" size="xs" icon={ArrowRight} iconPosition="right">
                      View Project
                    </Button>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
