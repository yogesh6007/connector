import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import {
  FileCheck2,
  Calendar,
  Building2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { formatDate, getStatusBadgeColor } from '../../utils/helpers';

export default function Applications() {
  const { currentUser } = useAuth();
  const { applications } = useApp();

  const myApplications = applications.filter((a) => a.studentId === currentUser.id);
  const [statusFilter, setStatusFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All Applications', count: myApplications.length },
    {
      id: 'active',
      label: 'In Review',
      count: myApplications.filter((a) => ['Applied', 'Under Review'].includes(a.status)).length
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted & Interviews',
      count: myApplications.filter((a) => ['Shortlisted', 'Interview'].includes(a.status)).length
    }
  ];

  const filteredApps = myApplications.filter((app) => {
    if (statusFilter === 'active') return ['Applied', 'Under Review'].includes(app.status);
    if (statusFilter === 'shortlisted') return ['Shortlisted', 'Interview', 'Accepted'].includes(app.status);
    return true;
  });

  const getStepIndex = (status) => {
    switch (status) {
      case 'Applied':
        return 1;
      case 'Under Review':
        return 2;
      case 'Shortlisted':
        return 3;
      case 'Interview':
        return 4;
      case 'Accepted':
        return 5;
      case 'Rejected':
        return 2;
      default:
        return 1;
    }
  };

  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Decision'];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-xs text-slate-500">
            Track the real-time status of your fellowship, grant, and internship applications
          </p>
        </div>

        <Link to="/student/opportunities">
          <Button variant="gradient" size="sm" icon={Briefcase}>
            Explore More Opportunities
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={filterTabs} activeTab={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const currentStep = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {app.organizationName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {app.opportunityTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Applied on {formatDate(app.appliedDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Application Status Pipeline
                  </p>
                  <div className="grid grid-cols-5 gap-2 relative">
                    {steps.map((step, idx) => {
                      const stepNumber = idx + 1;
                      const isComplete = stepNumber <= currentStep && !isRejected;
                      const isCurrent = stepNumber === currentStep;

                      return (
                        <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                                : isComplete
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isComplete && !isCurrent ? '✓' : stepNumber}
                          </div>
                          <span
                            className={`text-[11px] font-semibold ${
                              isCurrent
                                ? 'text-indigo-600 font-bold'
                                : isComplete
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Statement / Submission Notes */}
                {app.statement && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900">Your Motivation Statement:</span>
                    <p className="leading-relaxed italic">"{app.statement}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No applications in this view"
          description="You haven't submitted applications in this category yet. Explore available opportunities and grants!"
          actionLabel="Browse Opportunities"
          onAction={() => window.location.assign('/student/opportunities')}
        />
      )}
    </div>
  );
}
