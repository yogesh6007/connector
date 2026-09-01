import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../utils/constants';
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  Users2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Bell,
  User,
  Settings,
  Sparkles,
  Layers,
  FileCheck2,
  LogOut,
  X
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuth();
  const { notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentNavItems = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/feed', icon: Sparkles, label: 'Social Feed' },
    { to: '/student/explore', icon: Compass, label: 'Explore' },
    { to: '/student/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/student/teammates', icon: Users2, label: 'Find Teammates', badge: 'Active' },
    { to: '/student/opportunities', icon: Briefcase, label: 'Opportunities' },
    { to: '/student/applications', icon: FileCheck2, label: 'My Applications' },
    { to: '/student/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications', count: unreadCount },
    { to: '/student/profile', icon: User, label: 'Profile' },
    { to: '/student/settings', icon: Settings, label: 'Settings' },
  ];

  const organizerNavItems = [
    { to: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/organizer/feed', icon: Sparkles, label: 'Social Feed' },
    { to: '/organizer/explore', icon: Compass, label: 'Explore' },
    { to: '/organizer/opportunities', icon: Briefcase, label: 'Manage Listings' },
    { to: '/organizer/applicants', icon: FileCheck2, label: 'Applicant CRM' },
    { to: '/organizer/students', icon: Users2, label: 'Student Talent' },
    { to: '/organizer/projects', icon: FolderKanban, label: 'Student Projects' },
    { to: '/organizer/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/organizer/notifications', icon: Bell, label: 'Notifications', count: unreadCount },
    { to: '/organizer/profile', icon: User, label: 'Brand Profile' },
    { to: '/organizer/settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = role === ROLES.ORGANIZER ? organizerNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 lg:top-16 bottom-0 left-0 z-50 lg:z-30 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto min-w-0">
          
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900">
                CONNECTOR
              </span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom Bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="p-2 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                src={user?.avatar || user?.logo}
                name={user?.name || 'User'}
                size="sm"
              />

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate capitalize">{role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
