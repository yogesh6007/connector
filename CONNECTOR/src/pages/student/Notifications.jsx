import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Bell,
  Sparkles,
  Heart,
  MessageCircle,
  FolderKanban,
  FileCheck2,
  Users2,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { userService } from '../../services/userService';

export const Notifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [processedRequests, setProcessedRequests] = useState({});
  const navigate = useNavigate();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'project_request':
      case 'project_status':
        return { icon: FolderKanban, bg: 'bg-purple-100 text-purple-700' };
      case 'application_update':
        return { icon: FileCheck2, bg: 'bg-emerald-100 text-emerald-700' };
      case 'connection_request':
      case 'connection_accepted':
        return { icon: Users2, bg: 'bg-indigo-100 text-indigo-700' };
      case 'post_like':
        return { icon: Heart, bg: 'bg-rose-100 text-rose-700' };
      default:
        return { icon: Sparkles, bg: 'bg-brand-100 text-brand-700' };
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'requests') return n.type?.includes('project') || n.type?.includes('connection');
    if (activeTab === 'career') return n.type?.includes('application');
    return true;
  });

  const handleAcceptRequest = async (e, notif) => {
    e.stopPropagation();
    try {
      await userService.acceptConnectionRequest(notif.connectionRequestId);
      setProcessedRequests(prev => ({ ...prev, [notif.id]: 'accepted' }));
      markNotificationAsRead(notif.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIgnoreRequest = async (e, notif) => {
    e.stopPropagation();
    try {
      await userService.rejectConnectionRequest(notif.connectionRequestId);
      setProcessedRequests(prev => ({ ...prev, [notif.id]: 'ignored' }));
      markNotificationAsRead(notif.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif) => {
    // Prevent navigating for pending request notifications when clicking the card itself
    if (notif.type === 'connection_request' && !processedRequests[notif.id]) {
      return;
    }
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Alert Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on team join requests, recruiter decisions, and network activity.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={CheckCheck}
          onClick={markAllNotificationsAsRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'requests', label: 'Team & Connections' },
          { id: 'career', label: 'Application Updates' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-400">You're completely up to date!</p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const { icon: Icon, bg } = getNotifIcon(notif.type);

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !notif.read
                    ? 'bg-brand-50/40 border-brand-200 hover:bg-brand-50/70 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs ${!notif.read ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.type === 'connection_request' && (
                       <div className="mt-2.5 flex items-center gap-2">
                         {processedRequests[notif.id] ? (
                           <span className="text-[11px] font-bold text-slate-400">
                             Request {processedRequests[notif.id]}
                           </span>
                         ) : (
                           <>
                             <Button
                               variant="primary"
                               size="xs"
                               onClick={(e) => handleAcceptRequest(e, notif)}
                             >
                               Accept
                             </Button>
                             <Button
                               variant="danger"
                               size="xs"
                               onClick={(e) => handleIgnoreRequest(e, notif)}
                             >
                               Ignore
                             </Button>
                           </>
                         )}
                       </div>
                     )}
                     <span className="text-[10px] text-slate-400 font-medium block mt-1">
                       {formatRelativeTime(notif.time)}
                     </span>
                  </div>
                </div>

                {notif.type === 'connection_request' && !processedRequests[notif.id] ? null : (
                   <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                 )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
