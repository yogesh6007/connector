import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageSquare,
  Search,
  Sparkles,
  PlusCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Repeat
} from 'lucide-react';
import Avatar from '../common/Avatar';

export default function StudentNavbar({ onOpenMobileSidebar }) {
  const { currentUser, logout, switchRole } = useAuth();
  const { notifications, conversations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Left section: mobile hamburger & search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Omni Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, projects, skills, opportunities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
          />
        </form>
      </div>

      {/* Right Section: Quick CTA, Notifications, Messages, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Create Project quick action */}
        <Link
          to="/student/projects/create"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 transition shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>

        {/* AI Teammate Finder shortcut */}
        <Link
          to="/student/teammates"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition"
          title="AI Teammate Matcher"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden md:inline">AI Matcher</span>
        </Link>

        {/* Messages */}
        <Link
          to="/student/messages"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          title="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </Link>

        {/* Notifications */}
        <Link
          to="/student/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white rounded-full ring-2 ring-white flex items-center justify-center">
              {unreadNotifs}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition text-left"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Student</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-scale-up"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>

              <Link
                to="/student/profile"
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                View Profile
              </Link>

              <Link
                to="/student/settings"
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings & Preferences
              </Link>

              <div className="my-1 border-t border-slate-100" />

              {/* Fast Role Switch for testing */}
              <button
                type="button"
                onClick={() => {
                  switchRole('organizer');
                  navigate('/organizer/dashboard');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 transition text-left"
              >
                <Repeat className="w-4 h-4 text-purple-500" />
                Switch to Organizer Role
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
