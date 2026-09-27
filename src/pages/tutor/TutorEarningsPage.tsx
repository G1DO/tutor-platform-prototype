import React from 'react';
import { DollarSign, TrendingUp, CheckCircle, Clock, ShieldCheck, Download } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';
import { Badge } from '../../components/common/Badge';

export const TutorEarningsPage: React.FC = () => {
  const { currentUser, state } = useDemo();

  if (!currentUser) return null;

  const myBookings = state.bookings.filter((b) => b.tutorId === currentUser.id);
  const completedBookings = myBookings.filter((b) => b.status === 'completed');
  const pendingBookings = myBookings.filter((b) => b.status === 'confirmed');

  // Business Rule:
  // "Count tutor earnings from completed sessions only."
  const totalGrossCompletedMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.priceMinorUnits,
    0
  );
  const totalCommissionMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.commissionMinorUnits,
    0
  );
  const totalNetEarningsMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.tutorEarningsMinorUnits,
    0
  );

  const pendingEarningsMinorUnits = pendingBookings.reduce(
    (sum, b) => sum + b.tutorEarningsMinorUnits,
    0
  );

  return (
    <div className="space-y-8 py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tutor Earnings & Payout Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review session gross volume, platform commission snapshots, and net earnings in Egyptian Pounds (EGP).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Total Net Earnings
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {formatEGP(totalNetEarningsMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">Delivered & completed sessions</p>
        </div>

        {/* Gross Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Gross Lesson Value
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatEGP(totalGrossCompletedMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">Total student billing</p>
        </div>

        {/* Commission Deducted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Platform Service Fee
          </span>
          <div className="text-2xl font-black text-slate-700">
            {formatEGP(totalCommissionMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">10% standard commission snapshot</p>
        </div>

        {/* Pending In-Escrow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending In-Escrow
          </span>
          <div className="text-2xl font-black text-amber-600">
            {formatEGP(pendingEarningsMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">{pendingBookings.length} upcoming session(s)</p>
        </div>
      </div>

      {/* Demo Rule Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
        <span>
          <strong>Prototype Rule:</strong> Tutor net payouts are unlocked and added to net earnings immediately upon completing the lesson. Prepaid amounts for upcoming lessons remain held in escrow until completed.
        </span>
      </div>

      {/* Session-Level Earnings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Completed Sessions Breakdown ({completedBookings.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Platform Commission: 10%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">Session Date</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6 text-right">Gross Price</th>
                <th className="py-3 px-6 text-right">Commission (10%)</th>
                <th className="py-3 px-6 text-right">Net Payout</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No completed sessions yet. Once a lesson is marked completed, earnings will be recorded here.
                  </td>
                </tr>
              ) : (
                completedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-700 font-semibold whitespace-nowrap">
                      {formatDateDisplay(b.date)}
                    </td>

                    <td className="py-4 px-6 text-slate-900 font-bold whitespace-nowrap">
                      {b.studentName}
                    </td>

                    <td className="py-4 px-6 text-indigo-700 font-semibold whitespace-nowrap">
                      {b.subject}
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {formatEGP(b.priceMinorUnits)}
                    </td>

                    <td className="py-4 px-6 text-right font-mono text-slate-500 whitespace-nowrap">
                      -{formatEGP(b.commissionMinorUnits)}
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-700 whitespace-nowrap text-sm">
                      {formatEGP(b.tutorEarningsMinorUnits)}
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <Badge variant="completed">Completed</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
