import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { User } from '../../types';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';

export const AdminTutorApplicationsPage: React.FC = () => {
  const { state, adminReviewApplication } = useDemo();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewReason, setReviewReason] = useState('All verification documents verified successfully.');

  const tutorApplications = state.users
    .filter((u) => u.role === 'tutor' && u.applicationStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredApps = tutorApplications.filter((u) => {
    if (filter === 'all') return true;
    return u.applicationStatus === filter;
  });

  const handleOpenReview = (tutor: User, action: 'approve' | 'reject') => {
    setSelectedTutor(tutor);
    setReviewAction(action);
    setReviewReason(
      action === 'approve'
        ? 'Verified degrees, government identification, and teaching credentials.'
        : 'Incomplete credential verification or unreadable degree certificate scan.'
    );
  };

  const handleConfirmReview = () => {
    if (!selectedTutor) return;
    adminReviewApplication(selectedTutor.id, reviewAction, reviewReason.trim());
    setSelectedTutor(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tutor Applications & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review applicant degrees, national IDs, and teaching experience before authorizing platform access.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
            <button
              type="button"
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                filter === st
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid / Table */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no tutor applications matching "{filter}".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar name={tutor.name} size="lg" avatarColor={tutor.avatarColor} />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{tutor.name}</h3>
                    <Badge variant={tutor.applicationStatus}>{tutor.applicationStatus}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">@{tutor.username}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{tutor.headline}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Email: <strong>{tutor.email}</strong></span>
                    <span>•</span>
                    <span>Subjects: <strong>{tutor.subjects?.join(', ')}</strong></span>
                    <span>•</span>
                    <span>Rate: <strong>{formatEGP(tutor.hourlyRateMinorUnits || 30000)}/hr</strong></span>
                  </div>

                  {/* Document previews */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      Submitted Verification Files ({tutor.documents?.length || 0}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.documents?.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold">{doc.name}</span>
                          <span className="text-slate-400 font-mono">({doc.fileName})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tutor.rejectionReason && (
                    <p className="text-xs text-rose-600 pt-1">
                      <strong>Rejection Note:</strong> {tutor.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-0 pt-3 lg:pt-0 border-slate-100">
                {tutor.applicationStatus === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenReview(tutor, 'approve')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenReview(tutor, 'reject')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                ) : tutor.applicationStatus === 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleOpenReview(tutor, 'reject')}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Revoke Approval
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenReview(tutor, 'approve')}
                    className="px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Re-Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Decision Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {reviewAction === 'approve'
                ? `Approve ${selectedTutor.name}?`
                : `Reject ${selectedTutor.name}?`}
            </h3>
            <p className="text-xs text-slate-600">
              {reviewAction === 'approve'
                ? 'Approving will immediately list this tutor in student searches and open their calendar for session bookings.'
                : 'Rejecting will prevent the tutor from receiving student bookings.'}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason / Internal Admin Note *
              </label>
              <textarea
                rows={3}
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTutor(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`px-4 py-2 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer ${
                  reviewAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
