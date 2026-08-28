import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Home,
  Compass,
  FolderGit2,
  Users2,
  Briefcase,
  FileCheck2,
  GraduationCap,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';

export default function StudentSidebar({ isMobile = false, onCloseMobile }) {
  const { currentUser, logout } = useAuth();
  const { notifications, conversations, projects } = useApp();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const myProjectsCount = projects.filter((p) => p.owner?.id === currentUser.id).length;

  const links = [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Social Feed', to: '/student/feed', icon: Home },
    { label: 'Explore', to: '/student/explore', icon: Compass },
    { label: 'Projects', to: '/student/projects', icon: FolderGit2, badge: myProjectsCount > 0 ? myProjectsCount : null },
    { label: 'Find Teammates', to: '/student/teammates', icon: Users2, highlight: true },
    { label: 'Opportunities', to: '/student/opportunities', icon: Briefcase },
    { label: 'Applications', to: '/student/applications', icon: FileCheck2 },
    { label: 'Mentors', to: '/student/mentors', icon: GraduationCap },
    { label: 'Messages', to: '/student/messages', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : null },
    { label: 'Notifications', to: '/student/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : null },
    { label: 'My Profile', to: '/student/profile', icon: User },
    { label: 'Settings', to: '/student/settings', icon: Settings }
  ];

  return (
    <aside className="h-full flex flex-col justify-between bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <NavLink to="/student/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              CONNECTOR
            </span>
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
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : link.highlight
                      ? 'text-purple-700 bg-purple-50/70 hover:bg-purple-100/80'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>

                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
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
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700">AI Matching Active</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Projects are dynamically ranked by skills.</p>
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
