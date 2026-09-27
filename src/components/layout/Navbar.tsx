import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Bell,
  Menu,
  X,
  Wallet,
  LogOut,
  User as UserIcon,
  CheckCheck,
  Shield,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../common/Avatar';
import { formatEGP } from '../../utils/currency';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    studentBalance,
    logout,
    state,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useDemo();

  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications for current user
  const userNotifications = currentUser
    ? state.notifications.filter((n) => n.userId === currentUser.id)
    : [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Pending applications count for admin badge
  const pendingAppsCount = state.users.filter(
    (u) => u.role === 'tutor' && u.applicationStatus === 'pending'
  ).length;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link
              to={
                currentRole === 'student'
                  ? '/student/dashboard'
                  : currentRole === 'tutor'
                  ? '/tutor/dashboard'
                  : currentRole === 'admin'
                  ? '/admin/dashboard'
                  : '/'
              }
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Tutor<span className="text-indigo-600">Connect</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  Demo
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Student Navigation */}
            {currentRole === 'student' && (
              <>
                <Link to="/student/dashboard" className={linkClass('/student/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/tutors" className={linkClass('/tutors')}>
                  Explore Tutors
                </Link>
                <Link to="/student/sessions" className={linkClass('/student/sessions')}>
                  My Sessions
                </Link>
                <Link to="/student/credit" className={linkClass('/student/credit')}>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                    Credit
                    <span className="ml-1 text-[11px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full">
                      {formatEGP(studentBalance)}
                    </span>
                  </span>
                </Link>
              </>
            )}

            {/* Tutor Navigation */}
            {currentRole === 'tutor' && (
              <>
                <Link to="/tutor/dashboard" className={linkClass('/tutor/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/tutor/bookings" className={linkClass('/tutor/bookings')}>
                  Bookings
                </Link>
                <Link to="/tutor/availability" className={linkClass('/tutor/availability')}>
                  Availability
                </Link>
                <Link to="/tutor/earnings" className={linkClass('/tutor/earnings')}>
                  Earnings
                </Link>
                <Link to="/tutor/reviews" className={linkClass('/tutor/reviews')}>
                  Reviews
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {currentRole === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                  Overview
                </Link>
                <Link to="/admin/users" className={linkClass('/admin/users')}>
                  Users
                </Link>
                <Link to="/admin/applications" className={linkClass('/admin/applications')}>
                  Applications
                  {pendingAppsCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
                      {pendingAppsCount}
                    </span>
                  )}
                </Link>
                <Link to="/admin/bookings" className={linkClass('/admin/bookings')}>
                  Bookings
                </Link>
                <Link to="/admin/transactions" className={linkClass('/admin/transactions')}>
                  Transactions
                </Link>
                <Link to="/admin/activity" className={linkClass('/admin/activity')}>
                  Logs
                </Link>
                <Link to="/admin/moderation" className={linkClass('/admin/moderation')}>
                  Moderation
                </Link>
                <Link to="/admin/settings" className={linkClass('/admin/settings')}>
                  Settings
                </Link>
              </>
            )}

            {/* Public/Guest Navigation */}
            {!currentUser && (
              <>
                <Link to="/" className={linkClass('/')}>
                  Home
                </Link>
                <Link to="/tutors" className={linkClass('/tutors')}>
                  Explore Tutors
                </Link>
                <Link
                  to="/login"
                  className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {/* Notifications Popover */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Notifications
                          </span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={() => markAllNotificationsAsRead(currentUser.id)}
                            className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {userNotifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          userNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                if (n.link) {
                                  navigate(n.link);
                                  setIsNotifOpen(false);
                                }
                              }}
                              className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${
                                !n.read ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-slate-900">{n.title}</span>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Avatar
                      name={currentUser.name}
                      size="sm"
                      avatarColor={currentUser.avatarColor}
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          Role: {currentUser.role}
                        </span>
                      </div>

                      <div className="p-1">
                        {currentRole === 'student' && (
                          <Link
                            to="/student/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            Edit Profile & Goals
                          </Link>
                        )}
                        {currentRole === 'tutor' && (
                          <Link
                            to="/tutor/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            Tutor Profile & Rate
                          </Link>
                        )}
                        {currentRole === 'admin' && (
                          <Link
                            to="/admin/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Shield className="w-4 h-4 text-slate-400" />
                            Platform Settings
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-1">
            {currentRole === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/student/dashboard')}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tutors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutors')}
                >
                  Explore Tutors
                </Link>
                <Link
                  to="/student/sessions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/student/sessions')}
                >
                  My Sessions
                </Link>
                <Link
                  to="/student/credit"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/student/credit')}
                >
                  Platform Credit ({formatEGP(studentBalance)})
                </Link>
                <Link
                  to="/student/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/student/profile')}
                >
                  My Profile
                </Link>
              </>
            )}

            {currentRole === 'tutor' && (
              <>
                <Link
                  to="/tutor/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/dashboard')}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tutor/bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/bookings')}
                >
                  Bookings
                </Link>
                <Link
                  to="/tutor/availability"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/availability')}
                >
                  Availability
                </Link>
                <Link
                  to="/tutor/earnings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/earnings')}
                >
                  Earnings
                </Link>
                <Link
                  to="/tutor/reviews"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/reviews')}
                >
                  Reviews
                </Link>
                <Link
                  to="/tutor/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutor/profile')}
                >
                  Tutor Profile
                </Link>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/dashboard')}
                >
                  Overview
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/users')}
                >
                  Users
                </Link>
                <Link
                  to="/admin/applications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/applications')}
                >
                  Applications ({pendingAppsCount} pending)
                </Link>
                <Link
                  to="/admin/bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/bookings')}
                >
                  Bookings
                </Link>
                <Link
                  to="/admin/transactions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/transactions')}
                >
                  Transactions & Ledger
                </Link>
                <Link
                  to="/admin/activity"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/activity')}
                >
                  Activity Logs
                </Link>
                <Link
                  to="/admin/moderation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/moderation')}
                >
                  Moderation & Reports
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/admin/settings')}
                >
                  Settings
                </Link>
              </>
            )}

            {!currentUser && (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/')}
                >
                  Home
                </Link>
                <Link
                  to="/tutors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/tutors')}
                >
                  Explore Tutors
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass('/login')}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
