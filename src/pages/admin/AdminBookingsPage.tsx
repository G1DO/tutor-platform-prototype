import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  XCircle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay, formatTimeDisplay } from '../../utils/date';
import { Booking } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const { state, cancelBooking, currentUser } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Administrative intervention');

  const filteredBookings = state.bookings
    .filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.studentName.toLowerCase().includes(q) ||
        b.tutorName.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleConfirmCancel = () => {
    if (!cancellingBooking || !currentUser) return;
    cancelBooking(cancellingBooking.id, currentUser.id, cancelReason);
    setCancellingBooking(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Platform Bookings & Sessions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor all scheduled 1-on-1 tutoring sessions, verify commission snapshots, and process cancellations.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, tutor, subject, or ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">ID & Subject</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Tutor</th>
                <th className="py-3 px-6">Date & Slot</th>
                <th className="py-3 px-6 text-right">Price / Commission</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{b.subject}</span>
                      <span className="text-[10px] font-mono text-slate-400">#{b.id}</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{b.studentName}</span>
                      <span className="block text-[11px] text-slate-400">{b.studentEmail}</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{b.tutorName}</span>
                      <span className="block text-[11px] text-slate-400">{b.tutorEmail}</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {formatDateDisplay(b.date)}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-mono">
                        {formatTimeDisplay(b.startTime)} - {formatTimeDisplay(b.endTime)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap font-mono">
                      <span className="font-bold text-slate-900">{formatEGP(b.priceMinorUnits)}</span>
                      <span className="block text-[11px] text-slate-500">
                        Comm: {formatEGP(b.commissionMinorUnits)} ({b.commissionRatePercent}%)
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={b.status}>{b.status}</Badge>
                      {b.status === 'cancelled' && b.cancellationReason && (
                        <span className="block text-[10px] text-rose-500 truncate max-w-[140px]">
                          {b.cancellationReason}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {b.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setCancellingBooking(b)}
                          className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Cancel & Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Cancel Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Admin Cancellation of Booking #{cancellingBooking.id}?
            </h3>
            <p className="text-xs text-slate-600">
              This will cancel the session and immediately credit <strong>{formatEGP(cancellingBooking.priceMinorUnits)}</strong> back to {cancellingBooking.studentName}'s platform wallet.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mandatory Administrative Reason *
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
