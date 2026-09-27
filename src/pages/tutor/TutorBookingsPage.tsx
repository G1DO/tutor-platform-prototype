import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Filter,
  DollarSign,
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay, formatTimeDisplay } from '../../utils/date';
import { ZoomLessonModal } from '../../components/modals/ZoomLessonModal';
import { Booking } from '../../types';

export const TutorBookingsPage: React.FC = () => {
  const { currentUser, state, completeBooking } = useDemo();

  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [activeZoomBooking, setActiveZoomBooking] = useState<Booking | null>(null);

  if (!currentUser) return null;

  const myBookings = state.bookings
    .filter((b) => b.tutorId === currentUser.id)
    .sort((a, b) => new Date(b.date + 'T' + b.startTime).getTime() - new Date(a.date + 'T' + a.startTime).getTime());

  const filteredBookings = myBookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const handleMarkComplete = (bookingId: string) => {
    completeBooking(bookingId, currentUser.id);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tutor Bookings & Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review confirmed student sessions, launch video classrooms, and mark lessons completed.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No bookings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no sessions matching the "{statusFilter}" status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar name={b.studentName} size="lg" avatarColor="bg-indigo-600 text-white" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {b.subject}
                    </span>
                    <Badge variant={b.status}>{b.status}</Badge>
                    <span className="text-[10px] text-slate-400 font-mono">#{b.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    Student: {b.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">Contact: {b.studentEmail}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {formatDateDisplay(b.date)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {formatTimeDisplay(b.startTime)} - {formatTimeDisplay(b.endTime)} ({b.timezone})
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">
                      Net Payout: {formatEGP(b.tutorEarningsMinorUnits)} (10% commission deducted)
                    </span>
                  </div>

                  {b.status === 'cancelled' && (
                    <p className="text-xs text-rose-600 mt-1">
                      Cancelled on {b.cancelledAt?.split('T')[0]}. Reason: {b.cancellationReason || 'N/A'}.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                {b.status === 'confirmed' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveZoomBooking(b)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Host Classroom
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarkComplete(b.id)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Conclude session and trigger tutor payout"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Mark Completed
                    </button>
                  </>
                )}

                {b.status === 'completed' && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Earnings Counted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classroom Modal */}
      <ZoomLessonModal
        isOpen={activeZoomBooking !== null}
        booking={activeZoomBooking}
        currentUserName={currentUser.name}
        onClose={() => setActiveZoomBooking(null)}
        canMarkCompleted={true}
        onMarkCompleted={() => {
          if (activeZoomBooking) {
            handleMarkComplete(activeZoomBooking.id);
            setActiveZoomBooking(null);
          }
        }}
      />
    </div>
  );
};
