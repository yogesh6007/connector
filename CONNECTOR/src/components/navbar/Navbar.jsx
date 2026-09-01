import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../utils/constants';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  LogOut,
  User,
  Menu,
  ChevronDown
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const Navbar = ({ onOpenSidebar }) => {
  const { user, logout, role } = useAuth();
  const { notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const explorePath = role === ROLES.ORGANIZER ? '/organizer/explore' : '/student/explore';
      navigate(`${explorePath}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/80 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to={role === ROLES.ORGANIZER ? '/organizer/dashboard' : '/student/dashboard'}
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  CONNECTOR
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${role === ROLES.ORGANIZER ? 'text-purple-600' : 'text-brand-600'}`}>
                  {role === ROLES.ORGANIZER ? 'Organizer Hub' : 'Student Hub'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Universal Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, projects, opportunities..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-brand-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </form>
          </div>

          {/* Right: Notifications, Messages, Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Direct Messages Icon */}
            <Link
              to={role === ROLES.ORGANIZER ? '/organizer/messages' : '/student/messages'}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>

            {/* Notifications Icon */}
            <Link
              to={role === ROLES.ORGANIZER ? '/organizer/notifications' : '/student/notifications'}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 transition-colors text-left"
              >
                <Avatar
                  src={user?.avatar || user?.logo}
                  name={user?.name || 'User'}
                  size="sm"
                  status="online"
                />

                <div className="hidden xl:block">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-elevated p-2 z-50 animate-fade-in space-y-1"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2.5">
                    <Avatar
                      src={user?.avatar || user?.logo}
                      name={user?.name || 'User'}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to={role === ROLES.ORGANIZER ? '/organizer/profile' : '/student/profile'}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};
