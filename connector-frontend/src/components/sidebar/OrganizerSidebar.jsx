import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Home,
  Compass,
  Briefcase,
  PlusCircle,
  Users,
  GraduationCap,
  FolderGit2,
  HeartHandshake,
  MessageSquare,
  Bell,
  Building2,
  Settings,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';

export default function OrganizerSidebar({ isMobile = false, onCloseMobile }) {
  const { currentUser, logout } = useAuth();
  const { notifications, conversations, applications, opportunities } = useApp();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const pendingApplicantsCount = applications.filter((a) => a.status === 'Applied' || a.status === 'Under Review').length;

  const links = [
    { label: 'Dashboard', to: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Feed & Updates', to: '/organizer/feed', icon: Home },
    { label: 'Explore', to: '/organizer/explore', icon: Compass },
    { label: 'Manage Opportunities', to: '/organizer/opportunities', icon: Briefcase },
    { label: 'Post Opportunity', to: '/organizer/opportunities/create', icon: PlusCircle, highlight: true },
    { label: 'Review Applicants', to: '/organizer/applicants', icon: Users, badge: pendingApplicantsCount > 0 ? pendingApplicantsCount : null },
    { label: 'Discover Students', to: '/organizer/students', icon: GraduationCap },
    { label: 'Student Projects', to: '/organizer/projects', icon: FolderGit2 },
    { label: 'Mentorship Program', to: '/organizer/mentorship', icon: HeartHandshake },
    { label: 'Messages', to: '/organizer/messages', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : null },
    { label: 'Notifications', to: '/organizer/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : null },
    { label: 'Organization Profile', to: '/organizer/profile', icon: Building2 },
    { label: 'Settings', to: '/organizer/settings', icon: Settings }
  ];

  return (
    <aside className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <NavLink to="/organizer/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                CONNECTOR
              </span>
              <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mt-0.5">Organizer Suite</span>
            </div>
          </NavLink>

          {isMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={isMobile ? onCloseMobile : undefined}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-xs'
                      : link.highlight
                      ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>

                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[11px] font-bold text-purple-900">Talent Discovery</span>
          </div>
          <p className="text-[10px] text-purple-700/80 mt-0.5">AI talent matcher analyzes 1,000+ student profiles.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
