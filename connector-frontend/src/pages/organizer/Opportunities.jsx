import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import {
  Briefcase,
  PlusCircle,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { formatDeadline } from '../../utils/helpers';

export default function OrganizerOpportunities() {
  const { currentUser } = useAuth();
  const { opportunities, updateOpportunityStatus } = useApp();

  const myOpportunities = opportunities.filter(
    (o) => o.organization?.id === currentUser.id || o.organization?.name === currentUser.name
  );
  const displayOpps = myOpportunities.length > 0 ? myOpportunities : opportunities;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Opportunities</h1>
          <p className="text-xs text-slate-500">
            Publish and monitor your corporate internships, hackathons, and research grants
          </p>
        </div>

        <Link to="/organizer/opportunities/create">
          <Button variant="gradient" size="sm" icon={PlusCircle}>
            Create New Opportunity
          </Button>
        </Link>
      </div>

      {/* Opportunities List */}
      {displayOpps.length > 0 ? (
        <div className="space-y-4">
          {displayOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary">{opp.type}</Badge>
                    <Badge variant={opp.status === 'Published' ? 'success' : 'default'}>
                      {opp.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{opp.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location} ({opp.workMode})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {opp.stipend || 'Competitive'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: {formatDeadline(opp.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <Link to="/organizer/applicants">
                    <Button variant="outline" size="sm" icon={Users}>
                      View Applicants ({opp.applicantsCount || 0})
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={opp.status === 'Published' ? 'secondary' : 'success'}
                    onClick={() =>
                      updateOpportunityStatus(
                        opp.id,
                        opp.status === 'Published' ? 'Closed' : 'Published'
                      )
                    }
                  >
                    {opp.status === 'Published' ? 'Close Listing' : 'Publish'}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(opp.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No opportunities published yet"
          description="Create your first internship, hackathon, or grant listing to attract student talent."
          actionLabel="Post Opportunity"
          onAction={() => window.location.assign('/organizer/opportunities/create')}
        />
      )}
    </div>
  );
}
