import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  RotateCcw,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay, formatTimeDisplay } from '../../utils/date';
import { ZoomLessonModal } from '../../components/modals/ZoomLessonModal';
import { RescheduleModal } from '../../components/modals/RescheduleModal';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { Booking } from '../../types';

export const StudentSessionsPage: React.FC = () => {
  const { currentUser, state, cancelBooking } = useDemo();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [activeZoomBooking, setActiveZoomBooking] = useState<Booking | null>(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<Booking | null>(null);
  const [reviewBookingTarget, setReviewBookingTarget] = useState<Booking | null>(null);

  // Cancellation state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Personal schedule conflict');
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!currentUser) return null;

  const myBookings = state.bookings.filter((b) => b.studentId === currentUser.id);

  const upcomingBookings = myBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = myBookings.filter((b) => b.status === 'completed');
  const cancelledBookings = myBookings.filter((b) => b.status === 'cancelled');

  const displayedBookings =
    activeTab === 'upcoming'
      ? upcomingBookings
      : activeTab === 'completed'
      ? completedBookings
      : cancelledBookings;

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    setCancelError(null);

    const res = cancelBooking(cancellingBooking.id, currentUser.id, cancelReason);
    if (res.success) {
      setCancellingBooking(null);
    } else {
      setCancelError(res.error || 'Failed to cancel session.');
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Tutoring Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your booked lessons, attend Zoom classrooms, reschedule times, or submit ratings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cancelled')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>
      </div>

      {/* Educational Banner regarding cancellation & rescheduling rules */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Prototype Booking Policy:</strong> Sessions can be cancelled before their scheduled start time for a 100% refund into platform credit. You can also reschedule to any open slot with the same tutor without paying again.
          </span>
        </div>
      </div>

      {/* Bookings List */}
      {displayedBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No {activeTab} tutoring sessions found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'You do not have any upcoming lessons scheduled. Find an available tutor in the directory!'
              : `There are currently no ${activeTab} sessions in your history.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((booking) => {
            // Find existing review if completed
            const review = state.reviews.find((r) => r.bookingId === booking.id);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
              >
                {/* Details */}
                <div className="flex items-start gap-4">
                  <Avatar name={booking.tutorName} size="lg" avatarColor="bg-blue-600 text-white" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {booking.subject}
                      </span>
                      <Badge variant={booking.status}>
                        {booking.status === 'confirmed'
                          ? 'Confirmed'
                          : booking.status === 'completed'
                          ? 'Completed'
                          : 'Cancelled'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{booking.id}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Lesson with {booking.tutorName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {formatDateDisplay(booking.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {formatTimeDisplay(booking.startTime)} - {formatTimeDisplay(booking.endTime)} ({booking.timezone})
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        Paid: <strong className="text-slate-900">{formatEGP(booking.priceMinorUnits)}</strong> ({booking.paymentMethod})
                      </span>
                    </div>

                    {booking.rescheduledFrom && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        Rescheduled from previous slot: {booking.rescheduledFrom}
                      </p>
                    )}

                    {booking.status === 'cancelled' && (
                      <p className="text-[11px] text-rose-600">
                        Cancelled at {booking.cancelledAt?.split('T')[0]}. Reason: {booking.cancellationReason || 'N/A'}. 100% refunded to credit.
                      </p>
                    )}

                    {review && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">Your Review:</span>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <p className="text-slate-600 italic">"{review.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons depending on status */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveZoomBooking(booking)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Classroom
                      </button>

                      <button
                        type="button"
                        onClick={() => setRescheduleBookingTarget(booking)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        Reschedule
                      </button>

                      <button
                        type="button"
                        onClick={() => setCancellingBooking(booking)}
                        className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === 'completed' && (
                    <>
                      {!booking.reviewed ? (
                        <button
                          type="button"
                          onClick={() => setReviewBookingTarget(booking)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Leave Review
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Reviewed
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Cancel Tutoring Session?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your {cancellingBooking.subject} lesson with {cancellingBooking.tutorName} on {formatDateDisplay(cancellingBooking.date)} at {formatTimeDisplay(cancellingBooking.startTime)}?
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold">Refund Guarantee:</span> The full session amount of <strong>{formatEGP(cancellingBooking.priceMinorUnits)}</strong> will be immediately credited to your platform wallet.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for cancellation:
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {cancelError && (
              <p className="text-xs text-rose-600 font-semibold">{cancelError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Keep Session
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Lesson Room Modal */}
      <ZoomLessonModal
        isOpen={activeZoomBooking !== null}
        booking={activeZoomBooking}
        currentUserName={currentUser.name}
        onClose={() => setActiveZoomBooking(null)}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleBookingTarget !== null}
        booking={rescheduleBookingTarget}
        onClose={() => setRescheduleBookingTarget(null)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewBookingTarget !== null}
        booking={reviewBookingTarget}
        onClose={() => setReviewBookingTarget(null)}
      />
    </div>
  );
};
