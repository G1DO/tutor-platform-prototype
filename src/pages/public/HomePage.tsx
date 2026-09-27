import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Star,
  CheckCircle,
  Video,
  Wallet,
  Shield,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { BookingModal } from '../../components/modals/BookingModal';
import { TutorApplyModal } from '../../components/modals/TutorApplyModal';
import { User } from '../../types';

export const HomePage: React.FC = () => {
  const { state, switchUser } = useDemo();
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<User | null>(null);
  const [isTutorApplyOpen, setIsTutorApplyOpen] = useState(false);

  // Active approved tutors for featured section
  const featuredTutors = state.users.filter(
    (u) =>
      u.role === 'tutor' &&
      u.applicationStatus === 'approved' &&
      u.status === 'active' &&
      !u.isBookingRestricted
  );

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Egypt's Modern Tutoring Marketplace Prototype
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Connect with Egypt's Best Tutors for STEM, Languages & Tech.
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed font-normal">
            Personalized 1-on-1 private lessons in Mathematics, Physics, English, Coding, and more. Experience the complete working prototype with simulated Paymob checkout and Zoom classrooms.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/tutors"
              className="px-6 py-3.5 bg-white text-indigo-900 hover:bg-indigo-50 active:bg-indigo-100 font-bold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-indigo-600" />
              Explore Tutors & Book
            </Link>

            <button
              type="button"
              onClick={() => setIsTutorApplyOpen(true)}
              className="px-6 py-3.5 bg-indigo-700/80 hover:bg-indigo-700 active:bg-indigo-800 border border-indigo-400/40 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-indigo-300" />
              Apply as a Tutor
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-indigo-700/60 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Admin-Verified Tutors</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Paymob & Credit Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Interactive Zoom Room</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Free Rescheduling</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Demo Credentials Quick-Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Exact Demo Accounts for Testing
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any quick-login button below to immediately access that role's interface and persistent demo data.
            </p>
          </div>
          <Link
            to="/login"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Go to Dedicated Login Page <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Student */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Student Account
                </span>
                <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                  EGP 1,000 Starting Credit
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-slate-700 space-y-0.5">
                <div>Username: <strong className="text-slate-900">user</strong></div>
                <div>Password: <strong className="text-slate-900">student</strong></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Book sessions, manage wallet credit, reschedule, join classrooms, and write tutor reviews.
              </p>
            </div>
            <button
              type="button"
              onClick={() => switchUser('student')}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In as Student
            </button>
          </div>

          {/* Tutor */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Tutor Account
                </span>
                <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                  Approved & Bookable
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-slate-700 space-y-0.5">
                <div>Username: <strong className="text-slate-900">tutor</strong></div>
                <div>Password: <strong className="text-slate-900">tutor</strong></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Manage bookings, complete sessions to earn money, set weekly availability, and view ratings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => switchUser('tutor')}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In as Tutor
            </button>
          </div>

          {/* Admin */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Admin Console
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Full Oversight
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-slate-700 space-y-0.5">
                <div>Username: <strong className="text-slate-900">admin</strong></div>
                <div>Password: <strong className="text-slate-900">admin</strong></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Approve tutor applications, inspect auditable ledger, adjust credit, moderate reviews, and configure commission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => switchUser('admin')}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Top Rated Educators
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Tutors in Cairo & Online
            </h2>
          </div>
          <Link
            to="/tutors"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View all {featuredTutors.length} tutors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTutors.slice(0, 6).map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-slate-300"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <Avatar
                    name={tutor.name}
                    size="lg"
                    avatarColor={tutor.avatarColor}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {tutor.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{tutor.headline}</p>
                    <div className="mt-1">
                      <StarRating
                        rating={tutor.rating || 5}
                        totalReviews={tutor.reviewCount}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {tutor.bio}
                </p>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tutor.subjects?.map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Book CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Session Rate
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {formatEGP(tutor.hourlyRateMinorUnits || 30000)}
                    <span className="text-xs font-normal text-slate-500"> / hr</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/tutor/${tutor.id}`}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedTutorForBooking(tutor)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={selectedTutorForBooking !== null}
        tutor={selectedTutorForBooking}
        onClose={() => setSelectedTutorForBooking(null)}
      />

      {/* Tutor Application Modal */}
      <TutorApplyModal
        isOpen={isTutorApplyOpen}
        onClose={() => setIsTutorApplyOpen(false)}
      />
    </div>
  );
};
