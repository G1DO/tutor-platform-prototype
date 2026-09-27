import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatEGP, formatSignedEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';
import { Badge } from '../../components/common/Badge';
import { StudentCreditAdjustmentModal } from '../../components/modals/StudentCreditAdjustmentModal';

export const AdminTransactionsPage: React.FC = () => {
  const { state } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  const transactions = [...state.transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredTxns = transactions.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.userName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      (t.referenceId && t.referenceId.toLowerCase().includes(q));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'opening_credit':
        return <Badge variant="primary">Opening Promo</Badge>;
      case 'top_up':
        return <Badge variant="active">Card Top-up</Badge>;
      case 'booking_deduction':
        return <Badge variant="neutral">Lesson Deduction</Badge>;
      case 'booking_refund':
        return <Badge variant="confirmed">Lesson Refund</Badge>;
      case 'admin_adjustment':
        return <Badge variant="suspended">Admin Adjustment</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Financial Ledger & Wallet Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete immutable transaction log of student deposits, session deductions, refunds, and adjustments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdjModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Make Credit Adjustment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, description, or ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Transaction Types</option>
            <option value="opening_credit">Opening Promo</option>
            <option value="top_up">Card Top-up (Paymob)</option>
            <option value="booking_deduction">Booking Deduction</option>
            <option value="booking_refund">Booking Refund</option>
            <option value="admin_adjustment">Admin Manual Adjustment</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Description & Audit Reason</th>
                <th className="py-3 px-6">Reference ID</th>
                <th className="py-3 px-6 text-right">Amount (EGP)</th>
                <th className="py-3 px-6 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {formatDateDisplay(t.timestamp.split('T')[0])}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        {t.timestamp.split('T')[1]?.slice(0, 5)} UTC
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {t.userName}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {getTransactionBadge(t.type)}
                    </td>

                    <td className="py-4 px-6 max-w-sm">
                      <p className="font-semibold text-slate-800">{t.description}</p>
                      {t.reason && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Note: {t.reason}</p>
                      )}
                    </td>

                    <td className="py-4 px-6 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {t.referenceId || t.id}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-bold text-sm ${
                          t.amountMinorUnits >= 0 ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {formatSignedEGP(t.amountMinorUnits)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-600 whitespace-nowrap">
                      {formatEGP(t.balanceAfterMinorUnits)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentCreditAdjustmentModal
        isOpen={isAdjModalOpen}
        onClose={() => setIsAdjModalOpen(false)}
      />
    </div>
  );
};
