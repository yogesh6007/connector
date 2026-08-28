import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import {
  Bell,
  Check,
  FolderGit2,
  Briefcase,
  Heart,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabs = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount }
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'teammate_request':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'application_update':
      case 'application_submitted':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'like':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'mentorship_accepted':
        return <Check className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500">
            Real-time updates regarding your teammate requests, application statuses, and network interactions
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={Check}
            onClick={markAllNotificationsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} />
      </div>

      {/* List */}
      {filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                notif.unread
                  ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getIconForType(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.content}</p>
                  <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                    {formatDate(notif.timestamp)}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  to={notif.link}
                  className="shrink-0 p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition"
                  title="View Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications here"
          description="You are completely caught up with your updates and team alerts."
        />
      )}
    </div>
  );
}
