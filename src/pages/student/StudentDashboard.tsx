import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Wallet,
  Video,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay, formatTimeDisplay } from '../../utils/date';
import { AddCreditModal } from '../../components/modals/AddCreditModal';
import { ZoomLessonModal } from '../../components/modals/ZoomLessonModal';
import { BookingModal } from '../../components/modals/BookingModal';
import { Booking, User } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { currentUser, studentBalance, state } = useDemo();

  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);
  const [activeZoomBooking, setActiveZoomBooking] = useState<Booking | null>(null);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<User | null>(null);

  if (!currentUser) return null;

  // Student bookings
  const myBookings = state.bookings.filter((b) => b.studentId === currentUser.id);
  const upcomingBookings = myBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = myBookings.filter((b) => b.status === 'completed');

  // Student recent transactions
  const myTransactions = state.transactions
    .filter((t) => t.userId === currentUser.id)
    .slice(0, 4);

  // Recommended tutors (approved, active, not restricted)
  const recommendedTutors = state.users
    .filter(
      (u) =>
        u.role === 'tutor' &&
        u.applicationStatus === 'approved' &&
        u.status === 'active' &&
        !u.isBookingRestricted
    )
    .slice(0, 3);

  // Unreviewed completed sessions
  const pendingReviews = completedBookings.filter((b) => !b.reviewed);

  return (
    <div className="space-y-8 py-6">
      {/* Top Greeting & Balance Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
              Student Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Goals: {currentUser.learningGoals || 'Master academic curriculum and improve test scores.'}
          </p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col justify-between shrink-0 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-300" />
              Platform Credit
            </span>
            <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
              Auditable Ledger
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {formatEGP(studentBalance)}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddCreditOpen(true)}
              className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Credit
            </button>
            <Link
              to="/student/credit"
              className="py-1.5 px-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              History
            </Link>
          </div>
        </div>
      </div>

      {/* Action alert if review is pending */}
      {pendingReviews.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              You have <strong>{pendingReviews.length} completed session(s)</strong> awaiting your feedback. Share your review to help other students!
            </span>
          </div>
          <Link
            to="/student/sessions"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold transition-colors shrink-0"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Grid: Upcoming Sessions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Upcoming Tutoring Sessions ({upcomingBookings.length})
            </h2>
            <Link
              to="/student/sessions"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all sessions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No upcoming sessions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our directory of verified STEM and language tutors to schedule your next 1-on-1 session.
              </p>
              <Link
                to="/tutors"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Find a Tutor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={b.tutorName} size="md" avatarColor="bg-blue-600 text-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {b.subject}
                        </span>
                        <Badge variant="confirmed">Confirmed</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        Lesson with {b.tutorName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          {formatDateDisplay(b.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          {formatTimeDisplay(b.startTime)} - {formatTimeDisplay(b.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveZoomBooking(b)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Classroom
                    </button>
                    <Link
                      to="/student/sessions"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity & Quick Recommendations */}
        <div className="space-y-6">
          {/* Recent Ledger Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-indigo-600" />
                Recent Wallet Activity
              </h3>
              <Link
                to="/student/credit"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                All Ledger
              </Link>
            </div>

            {myTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No transactions recorded.</p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-2">
                {myTransactions.map((tx) => (
                  <div key={tx.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {tx.description}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {formatDateDisplay(tx.timestamp.split('T')[0])}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        tx.amountMinorUnits >= 0 ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {tx.amountMinorUnits >= 0 ? '+' : ''}
                      {formatEGP(tx.amountMinorUnits)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Tutors Mini List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recommended Tutors</h3>
              <Link to="/tutors" className="text-[11px] font-semibold text-indigo-600">
                Explore
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedTutors.map((tut) => (
                <div key={tut.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={tut.name} size="sm" avatarColor={tut.avatarColor} />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{tut.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tut.subjects?.join(', ')} • {formatEGP(tut.hourlyRateMinorUnits || 30000)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTutorForBooking(tut)}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition-colors shrink-0 cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCreditModal
        isOpen={isAddCreditOpen}
        onClose={() => setIsAddCreditOpen(false)}
      />

      <ZoomLessonModal
        isOpen={activeZoomBooking !== null}
        booking={activeZoomBooking}
        currentUserName={currentUser.name}
        onClose={() => setActiveZoomBooking(null)}
      />

      <BookingModal
        isOpen={selectedTutorForBooking !== null}
        tutor={selectedTutorForBooking}
        onClose={() => setSelectedTutorForBooking(null)}
      />
    </div>
  );
};
