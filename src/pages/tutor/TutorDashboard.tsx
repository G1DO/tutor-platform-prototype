import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Video,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay, formatTimeDisplay } from '../../utils/date';
import { ZoomLessonModal } from '../../components/modals/ZoomLessonModal';
import { Booking } from '../../types';

export const TutorDashboard: React.FC = () => {
  const { currentUser, state, completeBooking } = useDemo();
  const [activeZoomBooking, setActiveZoomBooking] = useState<Booking | null>(null);

  if (!currentUser) return null;

  // Tutor bookings
  const myBookings = state.bookings.filter((b) => b.tutorId === currentUser.id);
  const upcomingBookings = myBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = myBookings.filter((b) => b.status === 'completed');

  // Business rule:
  // "Count tutor earnings from completed sessions only."
  const totalNetEarningsMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.tutorEarningsMinorUnits,
    0
  );

  // Reviews for this tutor
  const myReviews = state.reviews.filter(
    (r) => r.tutorId === currentUser.id && r.status === 'visible'
  );

  const handleMarkSessionComplete = (bookingId: string) => {
    completeBooking(bookingId, currentUser.id);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
              Tutor Portal
            </span>
            {currentUser.applicationStatus === 'approved' && (
              <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Approved & Bookable
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {currentUser.name}! 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            {currentUser.headline || 'STEM & Language Educator'}
          </p>
        </div>

        {/* Quick Rate & Availability Links */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            to="/tutor/availability"
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-xs transition-colors text-center"
          >
            Edit Weekly Availability
          </Link>
          <Link
            to="/tutor/profile"
            className="px-4 py-2.5 bg-blue-700/80 hover:bg-blue-700 border border-blue-400/40 text-white font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Hourly Rate ({formatEGP(currentUser.hourlyRateMinorUnits || 30000)})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upcoming */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Upcoming Sessions
          </span>
          <div className="text-2xl font-black text-slate-900">{upcomingBookings.length}</div>
          <p className="text-[11px] text-slate-500">Confirmed student lessons</p>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Completed Sessions
          </span>
          <div className="text-2xl font-black text-slate-900">{completedBookings.length}</div>
          <p className="text-[11px] text-slate-500">Delivered successfully</p>
        </div>

        {/* Net Demo Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Net Tutor Earnings
          </span>
          <div className="text-2xl font-black text-indigo-700">
            {formatEGP(totalNetEarningsMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-500">From completed sessions</p>
        </div>

        {/* Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            Average Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">
              {currentUser.rating ? currentUser.rating.toFixed(1) : '5.0'}
            </span>
            <StarRating rating={currentUser.rating || 5} size="sm" />
          </div>
          <p className="text-[11px] text-slate-500">{myReviews.length} student reviews</p>
        </div>
      </div>

      {/* Main Content Grid: Upcoming Bookings & Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Sessions with Demo "Complete" Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Student Lessons ({upcomingBookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Host sessions via Zoom, or mark completed to test tutor earnings and unlock student reviews.
              </p>
            </div>
            <Link
              to="/tutor/bookings"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              All bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No scheduled sessions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Students can book open slots from your weekly availability calendar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={b.studentName} size="md" avatarColor="bg-indigo-600 text-white" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {b.subject}
                        </span>
                        <Badge variant="confirmed">Confirmed</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Student: {b.studentName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {formatDateDisplay(b.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {formatTimeDisplay(b.startTime)} - {formatTimeDisplay(b.endTime)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Session Price: {formatEGP(b.priceMinorUnits)} • Net Payout after 10% commission: <strong className="text-emerald-700 font-bold">{formatEGP(b.tutorEarningsMinorUnits)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveZoomBooking(b)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Host Classroom
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarkSessionComplete(b.id)}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Demo Action: Conclude session, calculate net earnings, and enable student review"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recent Student Feedback */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                Recent Student Feedback
              </h3>
              <Link to="/tutor/reviews" className="text-[11px] font-semibold text-blue-600">
                All Reviews
              </Link>
            </div>

            {myReviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No reviews yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3">
                {myReviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{r.studentName}</span>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{r.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">
                      {formatDateDisplay(r.createdAt.split('T')[0])}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Status Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Weekly Schedule
            </h4>
            <p className="text-xs text-slate-600">
              Your calendar is accepting bookings across 7 days in Cairo time ({state.settings.timezone}).
            </p>
            <Link
              to="/tutor/availability"
              className="inline-block mt-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Update Availability Slots ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Classroom Modal */}
      <ZoomLessonModal
        isOpen={activeZoomBooking !== null}
        booking={activeZoomBooking}
        currentUserName={currentUser.name}
        onClose={() => setActiveZoomBooking(null)}
        canMarkCompleted={true}
        onMarkCompleted={() => {
          if (activeZoomBooking) {
            handleMarkSessionComplete(activeZoomBooking.id);
            setActiveZoomBooking(null);
          }
        }}
      />
    </div>
  );
};
