import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OpportunityCard from '../../components/cards/OpportunityCard';
import EmptyState from '../../components/common/EmptyState';
import { OPPORTUNITY_TYPES, WORK_MODES } from '../../utils/constants';
import {
  Briefcase,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Opportunities() {
  const { opportunities } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');

  const filteredOpportunities = opportunities.filter((opp) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      opp.title?.toLowerCase().includes(term) ||
      opp.organization?.name?.toLowerCase().includes(term) ||
      opp.description?.toLowerCase().includes(term) ||
      opp.skills?.some((s) => s.toLowerCase().includes(term));

    const matchesType = selectedType === 'All' || opp.type === selectedType;
    const matchesWorkMode = selectedWorkMode === 'All' || opp.workMode === selectedWorkMode;

    return matchesSearch && matchesType && matchesWorkMode;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Opportunities & Grants</h1>
        <p className="text-xs text-slate-500">
          Discover vetted internships, research grants, hackathons, fellowships, and full-time jobs from verified tech leaders
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, company, or technology (e.g. Python, Kubernetes)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
            >
              <option value="All">All Opportunity Types</option>
              {OPPORTUNITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="sm:col-span-3">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
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

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
          <span>{filteredOpportunities.length} Active opportunities published</span>
          <span className="text-emerald-600 font-bold">100% Verified Organizations</span>
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No opportunities found matching these filters"
          description="Try broadening your search or exploring other opportunity types."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedType('All');
            setSelectedWorkMode('All');
          }}
        />
      )}
    </div>
  );
}
