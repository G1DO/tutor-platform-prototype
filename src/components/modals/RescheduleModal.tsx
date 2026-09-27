import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Booking } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { getRelativeDate, formatDateDisplay, formatTimeDisplay, getDayOfWeekIndex } from '../../utils/date';

interface RescheduleModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSuccess,
}) => {
  const { state, rescheduleBooking, currentUser } = useDemo();

  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(2));
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tutor = useMemo(() => {
    if (!booking) return null;
    return state.users.find((u) => u.id === booking.tutorId) || null;
  }, [booking, state.users]);

  // Next 14 dates available
  const availableDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(getRelativeDate(i));
    }
    return dates;
  }, []);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!tutor || !selectedDate || !booking) return [];

    const dayIdx = getDayOfWeekIndex(selectedDate);
    const dayConfig = tutor.weeklyAvailability?.find((w) => w.dayOfWeek === dayIdx);
    if (!dayConfig || !dayConfig.slots) return [];

    return dayConfig.slots.map((slot) => {
      const isCurrentSlot = booking.date === selectedDate && booking.startTime === slot;
      const isBooked = state.bookings.some(
        (b) =>
          b.id !== booking.id &&
          b.tutorId === tutor.id &&
          b.date === selectedDate &&
          b.startTime === slot &&
          b.status === 'confirmed'
      );
      const isStudentConflict = currentUser
        ? state.bookings.some(
            (b) =>
              b.id !== booking.id &&
              b.studentId === currentUser.id &&
              b.date === selectedDate &&
              b.startTime === slot &&
              b.status === 'confirmed'
          )
        : false;

      return {
        slot,
        disabled: isBooked || isStudentConflict || isCurrentSlot,
        reason: isCurrentSlot
          ? 'Current Time'
          : isBooked
          ? 'Reserved'
          : isStudentConflict
          ? 'Your Schedule Conflict'
          : 'Available',
      };
    });
  }, [tutor, selectedDate, booking, state.bookings, currentUser]);

  if (!isOpen || !booking || !tutor) return null;

  const handleConfirmReschedule = () => {
    if (!selectedDate || !selectedSlot) {
      setErrorMsg('Please select a new date and available time slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = rescheduleBooking(booking.id, selectedDate, selectedSlot);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to reschedule booking.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
              Free Reschedule
            </span>
            <h2 id="reschedule-modal-title" className="text-lg font-bold text-white mt-0.5">
              Reschedule {booking.subject} Session
            </h2>
            <p className="text-xs text-slate-300">
              Current slot: {formatDateDisplay(booking.date)} at {formatTimeDisplay(booking.startTime)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Zero-cost rescheduling:</strong> You can transfer your upcoming booking to any open slot on {tutor.name}'s calendar without any extra fees.
            </span>
          </div>

          {/* 1. Date selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              1. Choose New Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {availableDates.map((dateStr) => {
                const isSelected = selectedDate === dateStr;
                const dateObj = new Date(dateStr + 'T00:00:00');
                const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

                return (
                  <button
                    type="button"
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlot('');
                    }}
                    className={`min-w-[80px] p-2.5 rounded-xl border text-center transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-medium uppercase tracking-wide opacity-80">
                      {weekday}
                    </div>
                    <div className="text-sm font-bold mt-0.5">{dayNum}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slot selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              2. Choose New Time Slot ({state.settings.timezone})
            </label>
            {availableSlots.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                Tutor has no open slots on this date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map(({ slot, disabled, reason }) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={disabled}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all relative ${
                        disabled
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs cursor-pointer'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 cursor-pointer'
                      }`}
                    >
                      {formatTimeDisplay(slot)}
                      {disabled && (
                        <span className="block text-[10px] no-underline font-normal text-slate-400">
                          {reason}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Keep Original Time
          </button>
          <button
            type="button"
            onClick={handleConfirmReschedule}
            disabled={isSubmitting || !selectedSlot}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? 'Updating Slot...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
};
