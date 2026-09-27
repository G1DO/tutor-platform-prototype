import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Star,
  BookOpen,
  CheckCircle,
  FileCheck,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { BookingModal } from '../../components/modals/BookingModal';
import { formatTimeDisplay, formatDateDisplay } from '../../utils/date';

export const TutorPublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const tutor = state.users.find((u) => u.id === id && u.role === 'tutor');

  if (!tutor) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Tutor Not Found</h2>
        <p className="text-xs text-slate-500">The requested tutor profile does not exist.</p>
        <Link
          to="/tutors"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tutors
        </Link>
      </div>
    );
  }

  // Visible student reviews for this tutor
  const tutorReviews = state.reviews.filter(
    (r) => r.tutorId === tutor.id && r.status === 'visible'
  );

  const isRestricted = tutor.isBookingRestricted || tutor.applicationStatus !== 'approved' || tutor.status !== 'active';

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/tutors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tutor Directory
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar
            name={tutor.name}
            size="xl"
            avatarColor={tutor.avatarColor}
            className="w-20 h-20 text-2xl"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{tutor.name}</h1>
              {tutor.applicationStatus === 'approved' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Expert
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium">{tutor.headline}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <StarRating
                rating={tutor.rating || 5}
                totalReviews={tutor.reviewCount}
                size="md"
              />
              <span>•</span>
              <span className="font-semibold text-slate-700">Cairo, Egypt (Online)</span>
            </div>
          </div>
        </div>

        {/* Rate & CTA Box */}
        <div className="w-full md:w-64 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shrink-0 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Session Price
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatEGP(tutor.hourlyRateMinorUnits || 30000)}
              <span className="text-xs font-normal text-slate-500"> / 60 mins</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Platform protection included. Free rescheduling anytime before session start.
            </p>
          </div>

          {isRestricted ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Bookings currently restricted by administrator.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Book 60-Minute Lesson
            </button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Biography, Subjects, Verified Docs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              About Dr. {tutor.name.split(' ').slice(-1)[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {tutor.bio}
            </p>
          </div>

          {/* Subjects Taught */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900">Subjects & Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects?.map((sub) => (
                <span
                  key={sub}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-100"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Documents (Fictional Records) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Verified Credentials
            </h2>
            <p className="text-xs text-slate-500">
              Credentials reviewed and verified by platform administrators before activation.
            </p>
            <div className="space-y-2 pt-1">
              {tutor.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Verified ID #{doc.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Student Reviews ({tutorReviews.length})
              </h2>
              <StarRating
                rating={tutor.rating || 5}
                size="sm"
              />
            </div>

            {tutorReviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No visible reviews yet. Completed student sessions will be reflected here.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-4 pt-2">
                {tutorReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={rev.studentName} size="sm" />
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            {rev.studentName}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {formatDateDisplay(rev.createdAt.split('T')[0])}
                          </span>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Weekly Availability Schedule Overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Weekly Schedule
            </h2>
            <p className="text-xs text-slate-500">
              Standard tutoring slots available on a recurring weekly basis ({state.settings.timezone}).
            </p>

            <div className="space-y-3 pt-2">
              {tutor.weeklyAvailability?.map((day) => (
                <div key={day.dayOfWeek} className="text-xs border-b border-slate-100 pb-2.5 last:border-0">
                  <span className="font-bold text-slate-700 block mb-1">
                    {day.dayName}
                  </span>
                  {day.slots.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {day.slots.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono"
                        >
                          {formatTimeDisplay(s)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No scheduled slots</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        tutor={tutor}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
