import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Plus,
  Users2,
  MapPin,
  Clock,
  Eye,
  Edit3,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OrganizerOpportunities = () => {
  const { user } = useAuth();
  const { opportunities } = useApp();

  const myOpportunities = opportunities.filter(o => o.orgId === user?.id || o.orgName === user?.name);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Opportunity Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Manage Published Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track student applicant volume, review talent match ratings, and update active listing statuses.
          </p>
        </div>

        <Link to="/organizer/opportunities/create">
          <Button variant="ai" size="md" icon={Plus} className="font-bold">
            Create Opportunity
          </Button>
        </Link>
      </div>

      {/* Listings Table / Cards */}
      <div className="space-y-4">
        {myOpportunities.map(opp => (
          <div
            key={opp.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 space-y-4 hover:shadow-elevated transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700">
                    {opp.type}
                  </span>
                  <Badge variant="success" size="xs">Active</Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {opp.location} ({opp.workMode})
                  </span>
                  <span className="font-semibold text-emerald-700">{opp.stipend}</span>
                  <span>Deadline: {opp.deadline}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="text-right text-xs pr-2">
                  <p className="text-base font-black text-slate-900">{opp.applicantsCount || 42}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Applicants</p>
                </div>

                <Link to="/organizer/applicants">
                  <Button variant="primary" size="sm" icon={Users2}>
                    Review Candidates
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {opp.description}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {(opp.skillsRequired || []).map(sk => (
                <span key={sk} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
