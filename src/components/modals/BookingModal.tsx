import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  CreditCard,
  Wallet,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { User, PaymentMethod } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { formatEGP } from '../../utils/currency';
import { getRelativeDate, formatDateDisplay, formatTimeDisplay, getDayOfWeekIndex } from '../../utils/date';
import { PaymobModal } from './PaymobModal';

interface BookingModalProps {
  isOpen: boolean;
  tutor: User | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  tutor,
  onClose,
  onSuccess,
}) => {
  const { currentUser, studentBalance, createBooking, state } = useDemo();

  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(1));
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymobOpen, setIsPaymobOpen] = useState(false);

  // Initialize subject when tutor changes
  React.useEffect(() => {
    if (tutor && tutor.subjects && tutor.subjects.length > 0) {
      setSelectedSubject(tutor.subjects[0]);
    }
    setSelectedDate(getRelativeDate(1));
    setSelectedSlot('');
    setErrorMsg(null);
  }, [tutor]);

  // Next 14 dates available for booking
  const availableDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = 1; i <= 14; i++) {
      dates.push(getRelativeDate(i));
    }
    return dates;
  }, []);

  // Compute available time slots for selectedDate based on tutor's weekly availability and existing bookings
  const availableSlots = useMemo(() => {
    if (!tutor || !selectedDate) return [];

    const dayIdx = getDayOfWeekIndex(selectedDate);
    const dayConfig = tutor.weeklyAvailability?.find((w) => w.dayOfWeek === dayIdx);
    if (!dayConfig || !dayConfig.slots) return [];

    // Filter out already booked slots
    return dayConfig.slots.map((slot) => {
      const isBooked = state.bookings.some(
        (b) =>
          b.tutorId === tutor.id &&
          b.date === selectedDate &&
          b.startTime === slot &&
          b.status === 'confirmed'
      );
      const isStudentConflict = currentUser
        ? state.bookings.some(
            (b) =>
              b.studentId === currentUser.id &&
              b.date === selectedDate &&
              b.startTime === slot &&
              b.status === 'confirmed'
          )
        : false;

      return {
        slot,
        disabled: isBooked || isStudentConflict,
        reason: isBooked ? 'Reserved' : isStudentConflict ? 'Your Schedule Conflict' : 'Available',
      };
    });
  }, [tutor, selectedDate, state.bookings, currentUser]);

  if (!isOpen || !tutor) return null;

  const priceMinorUnits = tutor.hourlyRateMinorUnits || 30000;
  const hasSufficientCredit = studentBalance >= priceMinorUnits;

  // Handle direct credit booking
  const handleConfirmCreditBooking = () => {
    if (!currentUser) {
      setErrorMsg('Please log in as a student to book a session.');
      return;
    }
    if (!selectedSubject) {
      setErrorMsg('Please select a subject.');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      setErrorMsg('Please choose an available date and time slot.');
      return;
    }
    if (!hasSufficientCredit) {
      setErrorMsg('Insufficient platform credit balance. Please select Paymob or top up your credit.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = createBooking({
      studentId: currentUser.id,
      tutorId: tutor.id,
      subject: selectedSubject,
      date: selectedDate,
      startTime: selectedSlot,
      paymentMethod: 'credit',
    });

    setIsSubmitting(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to complete booking.');
    }
  };

  // Handle Paymob booking trigger
  const handleProceedPaymob = () => {
    if (!currentUser) {
      setErrorMsg('Please log in as a student to book a session.');
      return;
    }
    if (!selectedSubject) {
      setErrorMsg('Please select a subject.');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      setErrorMsg('Please choose an available date and time slot.');
      return;
    }

    setErrorMsg(null);
    setIsPaymobOpen(true);
  };

  const handlePaymobSuccess = (refId: string) => {
    setIsPaymobOpen(false);
    if (!currentUser) return;

    const res = createBooking({
      studentId: currentUser.id,
      tutorId: tutor.id,
      subject: selectedSubject,
      date: selectedDate,
      startTime: selectedSlot,
      paymentMethod: 'paymob',
      paymobReference: refId,
    });

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Payment recorded but booking creation failed.');
    }
  };

  const handlePaymobFailure = (reason: string) => {
    setIsPaymobOpen(false);
    setErrorMsg(`Paymob simulated payment failed: ${reason}`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  Step-by-step Booking
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  60 Min Session
                </span>
              </div>
              <h2 id="booking-modal-title" className="text-lg font-bold text-white mt-0.5">
                Book a Session with {tutor.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Choose Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                1. Select Subject
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tutor.subjects?.map((sub) => (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      selectedSubject === sub
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                2. Select Date
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

            {/* 3. Choose Time Slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                3. Available Time Slot ({state.settings.timezone})
              </label>
              {availableSlots.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Tutor has no scheduled availability on {formatDateDisplay(selectedDate)}. Please choose another date.
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
                        title={disabled ? reason : `Select ${formatTimeDisplay(slot)}`}
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

            {/* 4. Payment Method & Price Breakdown */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                4. Payment Method & Price Summary
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Platform Credit Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-indigo-600" />
                      Platform Credit
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        hasSufficientCredit
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Balance: {formatEGP(studentBalance)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Instant deduction from your auditable wallet ledger.
                  </p>
                  {!hasSufficientCredit && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      Insufficient balance for this session.
                    </p>
                  )}
                </button>

                {/* Paymob Mock Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paymob')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'paymob'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      Paymob Checkout
                    </span>
                    <span className="text-[11px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Cards / Wallets
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Simulate card payment via Paymob sandbox modal.
                  </p>
                </button>
              </div>

              {/* Price Breakdown Snapshot Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Tutor 60-Minute Rate (Snapshot)</span>
                  <span className="font-semibold text-slate-900">{formatEGP(priceMinorUnits)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service & Protection Fee</span>
                  <span className="font-semibold text-emerald-600">Free (Demo)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total Amount to Pay</span>
                  <span className="text-lg font-extrabold text-indigo-700">
                    {formatEGP(priceMinorUnits)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full refund to credit if cancelled before start time</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {paymentMethod === 'credit' ? (
                <button
                  type="button"
                  onClick={handleConfirmCreditBooking}
                  disabled={isSubmitting || !selectedSlot || !hasSufficientCredit}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Confirming...' : `Confirm & Deduct ${formatEGP(priceMinorUnits)}`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedPaymob}
                  disabled={!selectedSlot}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Paymob ({formatEGP(priceMinorUnits)})
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Paymob Sandbox Modal */}
      <PaymobModal
        isOpen={isPaymobOpen}
        amountMinorUnits={priceMinorUnits}
        description={`Tutoring session: ${selectedSubject} with ${tutor.name} (${selectedDate} at ${selectedSlot})`}
        onSuccess={handlePaymobSuccess}
        onFailure={handlePaymobFailure}
        onCancel={() => setIsPaymobOpen(false)}
      />
    </>
  );
};
