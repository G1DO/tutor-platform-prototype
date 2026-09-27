import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StarRating } from '../../components/common/StarRating';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { formatDateDisplay } from '../../utils/date';
import { User } from '../../types';

export const AdminModerationPage: React.FC = () => {
  const {
    state,
    adminModerateReview,
    adminRestrictTutorBooking,
    adminResolveChatReport,
  } = useDemo();

  const [activeTab, setActiveTab] = useState<'reviews' | 'restrictions' | 'reports'>('reviews');

  // Tutor restriction modal state
  const [restrictTarget, setRestrictTarget] = useState<User | null>(null);
  const [restrictionReason, setRestrictionReason] = useState('Excessive last-minute session cancellations.');

  const tutors = state.users.filter((u) => u.role === 'tutor');

  const handleConfirmRestrictionToggle = () => {
    if (!restrictTarget) return;
    const shouldRestrict = !restrictTarget.isBookingRestricted;
    adminRestrictTutorBooking(restrictTarget.id, shouldRestrict, restrictionReason);
    setRestrictTarget(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Moderation & Safety Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Moderate student feedback, manually restrict tutor booking privileges with recorded reasons, and resolve chat reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Moderation ({state.reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('restrictions')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'restrictions'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutor Booking Restrictions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chat Reports ({state.chatReports.filter((r) => r.status === 'pending').length} pending)
          </button>
        </div>
      </div>

      {/* 1. Review Moderation Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                All Student Reviews ({state.reviews.length})
              </h2>
              <p className="text-xs text-slate-500">
                Hiding an offensive or invalid review automatically removes it from the tutor's public rating calculation.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {state.reviews.map((r) => {
                const tutor = state.users.find((u) => u.id === r.tutorId);
                return (
                  <div
                    key={r.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{r.studentName}</span>
                        <span className="text-slate-400 text-xs">reviewing</span>
                        <span className="font-semibold text-indigo-700 text-xs">
                          {tutor?.name || 'Tutor'}
                        </span>
                        <Badge variant={r.status}>{r.status}</Badge>
                      </div>

                      <div className="flex items-center gap-2 py-0.5">
                        <StarRating rating={r.rating} size="sm" />
                        <span className="text-[10px] text-slate-400">
                          {formatDateDisplay(r.createdAt.split('T')[0])}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>

                    <div className="shrink-0">
                      {r.status === 'visible' ? (
                        <button
                          type="button"
                          onClick={() => adminModerateReview(r.id, 'hidden')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide Review
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => adminModerateReview(r.id, 'visible')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Restore Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Tutor Restrictions Tab */}
      {activeTab === 'restrictions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Manual Tutor Booking Restrictions
              </h2>
              <p className="text-xs text-slate-500">
                Explicit prototype requirement: administrators can manually restrict tutors from accepting new bookings with a recorded reason (no arbitrary automatic penalty policies).
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar name={tutor.name} size="md" avatarColor={tutor.avatarColor} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {tutor.name}
                        </span>
                        {tutor.isBookingRestricted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Bookings Restricted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Bookable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tutor.subjects?.join(', ')} • Rating: {tutor.rating?.toFixed(1) || 'N/A'}
                      </p>
                      {tutor.isBookingRestricted && tutor.bookingRestrictedReason && (
                        <p className="text-xs text-rose-600 mt-1 font-medium">
                          Restriction Reason: {tutor.bookingRestrictedReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRestrictTarget(tutor);
                      setRestrictionReason(
                        tutor.isBookingRestricted
                          ? ''
                          : 'Administrative review or student dispute investigation.'
                      );
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      tutor.isBookingRestricted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {tutor.isBookingRestricted ? 'Lift Restriction' : 'Restrict Bookings'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Chat Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Seeded Incident & Chat Reports ({state.chatReports.length})
              </h2>
              <p className="text-xs text-slate-500">
                Review flagged communications, policy violations (such as off-platform payment attempts), and dismiss or resolve reports.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {state.chatReports.map((report) => (
                <div key={report.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Reported User: {report.reportedUserName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        by {report.reporterName}
                      </span>
                      <Badge variant={report.status === 'pending' ? 'pending' : 'neutral'}>
                        {report.status}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDateDisplay(report.timestamp.split('T')[0])}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-rose-700 block">
                      Violation: {report.reason}
                    </span>
                    <blockquote className="text-slate-700 italic border-l-2 border-slate-300 pl-2">
                      "{report.snippet}"
                    </blockquote>
                    {report.adminNote && (
                      <p className="text-[11px] text-indigo-700 pt-1">
                        <strong>Admin Note:</strong> {report.adminNote}
                      </p>
                    )}
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => adminResolveChatReport(report.id, 'dismiss', 'Dismissed after review.')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => adminResolveChatReport(report.id, 'resolve', 'Warned user regarding off-platform payment policy.')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Resolve with Warning
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Restriction Confirmation Dialog */}
      {restrictTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {restrictTarget.isBookingRestricted
                ? `Lift restriction for ${restrictTarget.name}?`
                : `Restrict new bookings for ${restrictTarget.name}?`}
            </h3>
            <p className="text-xs text-slate-600">
              {restrictTarget.isBookingRestricted
                ? 'This tutor will immediately reappear in student searches and become eligible for new bookings.'
                : 'This tutor will be hidden from student searches and prevented from taking new bookings.'}
            </p>

            {!restrictTarget.isBookingRestricted && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mandatory Reason for Restriction *
                </label>
                <textarea
                  rows={2}
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRestrictTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestrictionToggle}
                className={`px-4 py-2 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer ${
                  restrictTarget.isBookingRestricted
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {restrictTarget.isBookingRestricted ? 'Lifting' : 'Restriction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
