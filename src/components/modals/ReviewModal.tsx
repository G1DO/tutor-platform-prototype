import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Booking } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { StarRating } from '../common/StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSuccess,
}) => {
  const { addReview, currentUser } = useDemo();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!comment.trim()) {
      setErrorMsg('Please write a short review sharing your learning experience.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = addReview({
      bookingId: booking.id,
      tutorId: booking.tutorId,
      studentId: currentUser.id,
      rating,
      comment: comment.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Completed Session Review
            </span>
            <h2 id="review-modal-title" className="text-lg font-bold text-white mt-0.5">
              Rate your {booking.subject} Lesson
            </h2>
            <p className="text-xs text-slate-300">Tutor: {booking.tutorName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Star Picker */}
          <div className="text-center py-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Rating
            </span>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={(newRating) => setRating(newRating)}
                size="lg"
              />
            </div>
            <span className="block text-xs font-bold text-indigo-700 mt-2">
              {rating === 5
                ? '5 Stars — Excellent session! Highly recommend.'
                : rating === 4
                ? '4 Stars — Very good, learned a lot.'
                : rating === 3
                ? '3 Stars — Average, met expectations.'
                : rating === 2
                ? '2 Stars — Needs improvement.'
                : '1 Star — Unsatisfactory experience.'}
            </span>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Written Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like about the tutor's teaching style? Did they answer all your questions?"
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Posting Review...' : 'Submit Student Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
