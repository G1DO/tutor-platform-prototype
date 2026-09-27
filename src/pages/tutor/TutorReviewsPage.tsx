import React from 'react';
import { Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StarRating } from '../../components/common/StarRating';
import { Avatar } from '../../components/common/Avatar';
import { formatDateDisplay } from '../../utils/date';

export const TutorReviewsPage: React.FC = () => {
  const { currentUser, state } = useDemo();

  if (!currentUser) return null;

  const myReviews = state.reviews
    .filter((r) => r.tutorId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const visibleReviews = myReviews.filter((r) => r.status === 'visible');

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Student Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Read direct feedback from students who completed tutoring sessions with you.
          </p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <StarRating rating={currentUser.rating || 5} size="md" />
          <span className="text-sm font-black text-slate-900">
            {currentUser.rating?.toFixed(1) || '5.0'} / 5.0
          </span>
          <span className="text-xs text-slate-400">
            ({visibleReviews.length} visible reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      {visibleReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No reviews yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once students finish their scheduled lessons, their ratings and comments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={rev.studentName} size="sm" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {rev.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateDisplay(rev.createdAt.split('T')[0])}
                    </span>
                  </div>
                </div>
                <StarRating rating={rev.rating} size="sm" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Student Lesson
                </span>
                <span className="font-mono">#{rev.bookingId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
