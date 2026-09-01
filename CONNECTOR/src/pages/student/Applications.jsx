import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  FileCheck2,
  Briefcase,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const Applications = () => {
  const { user } = useAuth();
  const { applications } = useApp();

  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Shortlisted':
      case 'Interview':
        return 'brand';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Recruitment Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your recruitment progression across applied internships, fellowships, and research grants.
          </p>
        </div>

        <Link to="/student/opportunities">
          <Button variant="secondary" size="md">
            Explore Opportunities
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No applications yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Explore active opportunities and apply when you find the right fellowship or internship.
          </p>
          <Link to="/student/opportunities" className="inline-block pt-2">
            <Button variant="primary" size="sm" icon={Briefcase}>
              Explore Opportunities
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Applications List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {applications.map(app => {
              const isSelected = app.id === selectedAppId;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/10'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Applied {formatRelativeTime(app.appliedDate)}
                    </span>
                    <Badge variant={getStatusBadgeVariant(app.status)} size="xs">
                      {app.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{app.opportunityTitle}</h4>
                    <p className="text-[11px] text-brand-700 font-semibold">{app.orgName}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline & Details (7 Cols) */}
          {selectedApp && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedApp.opportunityTitle}</h3>
                  <p className="text-xs font-semibold text-brand-700 mt-0.5">{selectedApp.orgName}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(selectedApp.status)} size="sm">
                  {selectedApp.status}
                </Badge>
              </div>

              {/* Recruitment Stage Pipeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Application Stages</h4>
                
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                  {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Accepted'].map((stage, idx) => {
                    const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Accepted'];
                    const currentIdx = stages.indexOf(selectedApp.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = selectedApp.status === stage;

                    return (
                      <div key={stage} className="space-y-1">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCurrent
                              ? 'bg-brand-600 ring-2 ring-brand-500/20'
                              : isPassed
                              ? 'bg-emerald-500'
                              : 'bg-slate-200'
                          }`}
                        />
                        <span className={isCurrent ? 'text-brand-600 font-black' : isPassed ? 'text-slate-800' : 'text-slate-400'}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline History */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Activity History</h4>
                
                <div className="space-y-2">
                  {(selectedApp.timeline || []).map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{t.status}</span>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(t.date)}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{t.note}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
