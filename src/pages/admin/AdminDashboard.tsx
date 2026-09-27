import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  Shield,
  ArrowRight,
  AlertCircle,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';
import { StudentCreditAdjustmentModal } from '../../components/modals/StudentCreditAdjustmentModal';

export const AdminDashboard: React.FC = () => {
  const { state } = useDemo();
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  // Derived metrics from actual stored records
  const students = state.users.filter((u) => u.role === 'student');
  const tutors = state.users.filter((u) => u.role === 'tutor');
  const pendingApplications = tutors.filter((u) => u.applicationStatus === 'pending');
  const confirmedBookings = state.bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = state.bookings.filter((b) => b.status === 'completed');

  // Financial totals derived from ledger and completed bookings
  const totalCompletedGrossMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.priceMinorUnits,
    0
  );
  const totalCommissionRevenueMinorUnits = completedBookings.reduce(
    (sum, b) => sum + b.commissionMinorUnits,
    0
  );

  // Total student credit liability across all students
  const totalStudentCreditLiability = state.transactions.reduce(
    (sum, t) => sum + t.amountMinorUnits,
    0
  );

  // Recent 5 audit logs
  const recentLogs = state.auditLogs.slice(0, 5);

  return (
    <div className="space-y-8 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Platform Administration Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            System Overview & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live metrics derived from stored mock ledger transactions, bookings, and user records.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsAdjModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Adjust Student Credit
          </button>
          <Link
            to="/admin/applications"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors"
          >
            Review Applications ({pendingApplications.length})
          </Link>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingApplications.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingApplications.length} Tutor Application(s)</strong> awaiting administrative review and credential verification.
            </span>
          </div>
          <Link
            to="/admin/applications"
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors shrink-0"
          >
            Inspect Applications
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            Total Students
          </span>
          <div className="text-2xl font-black text-slate-900">{students.length}</div>
          <p className="text-[11px] text-slate-400">Registered platform learners</p>
        </div>

        {/* Total Tutors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Total Tutors
          </span>
          <div className="text-2xl font-black text-slate-900">{tutors.length}</div>
          <p className="text-[11px] text-slate-400">
            {tutors.filter((t) => t.applicationStatus === 'approved').length} approved & active
          </p>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-600" />
            Total Bookings
          </span>
          <div className="text-2xl font-black text-slate-900">{state.bookings.length}</div>
          <p className="text-[11px] text-slate-400">
            {confirmedBookings.length} upcoming • {completedBookings.length} completed
          </p>
        </div>

        {/* Commission Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Commission Revenue
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {formatEGP(totalCommissionRevenueMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">Default rate: {state.settings.commissionRatePercent}%</p>
        </div>

        {/* Gross Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Gross Volume Completed
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatEGP(totalCompletedGrossMinorUnits)}
          </div>
          <p className="text-[11px] text-slate-400">Total session payments processed</p>
        </div>

        {/* Credit In-Circulation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Student Credit Ledger
          </span>
          <div className="text-2xl font-black text-indigo-700">
            {formatEGP(totalStudentCreditLiability)}
          </div>
          <p className="text-[11px] text-slate-400">Total circulating wallet balance</p>
        </div>

        {/* Pending Applications Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Applications
          </span>
          <div className="text-2xl font-black text-amber-600">
            {pendingApplications.length}
          </div>
          <p className="text-[11px] text-slate-400">Awaiting background check</p>
        </div>

        {/* Chat Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Chat Reports
          </span>
          <div className="text-2xl font-black text-rose-600">
            {state.chatReports.filter((r) => r.status === 'pending').length}
          </div>
          <p className="text-[11px] text-slate-400">Moderation flags</p>
        </div>
      </div>

      {/* Split Section: Recent Activity Logs & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Administrative Audit Log (Recent Entries)
            </h2>
            <Link
              to="/admin/activity"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Full log ({state.auditLogs.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDateDisplay(log.timestamp.split('T')[0])}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.details}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Actor: <strong>{log.actorName}</strong> ({log.actorRole})</span>
                  <span>•</span>
                  <span>Target: {log.targetType} #{log.targetId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Admin Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Management Portals</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Students & Tutors Directory</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/applications"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Tutor Applications Review</span>
                {pendingApplications.length > 0 && (
                  <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    {pendingApplications.length}
                  </span>
                )}
              </Link>

              <Link
                to="/admin/transactions"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Financial Ledger & Audit</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/moderation"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Reviews & Chat Moderation</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Commission & Platform Settings</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <StudentCreditAdjustmentModal
        isOpen={isAdjModalOpen}
        onClose={() => setIsAdjModalOpen(false)}
      />
    </div>
  );
};
