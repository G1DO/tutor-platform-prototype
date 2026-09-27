import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  ShieldCheck,
  Calendar,
  FileText,
  CreditCard,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatEGP, formatSignedEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';
import { AddCreditModal } from '../../components/modals/AddCreditModal';
import { Badge } from '../../components/common/Badge';

export const StudentCreditPage: React.FC = () => {
  const { currentUser, studentBalance, state } = useDemo();
  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);

  if (!currentUser) return null;

  // Student's transactions sorted chronologically desc
  const myTransactions = state.transactions
    .filter((t) => t.userId === currentUser.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
    <div className="space-y-8 py-6">
      {/* Title & Balance Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Auditable Transaction Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Platform Credit Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Your credit balance is strictly calculated as the sum of all immutable ledger transactions. Credits never expire and can be used for any subject or tutor.
          </p>
        </div>

        {/* Balance Display & Add Credit Action */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shrink-0 min-w-[260px] shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-amber-400" />
            Current Wallet Balance
          </span>
          <div className="text-3xl font-black text-white mt-1">
            {formatEGP(studentBalance)}
          </div>
          <button
            type="button"
            onClick={() => setIsAddCreditOpen(true)}
            className="mt-4 w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Credit (via Paymob)
          </button>
        </div>
      </div>

      {/* Financial Guarantees Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Immutable Ledger</span>
            <span className="text-slate-500">Every deduction, top-up, and refund records an unalterable transaction entry.</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Instant Cancellation Refunds</span>
            <span className="text-slate-500">Prepaid sessions cancelled before start time are immediately refunded back into credit.</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 block">Simulated Paymob Gateway</span>
            <span className="text-slate-500">Fast card top-ups with full payment reference and test error handling.</span>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Ledger Transaction Entries ({myTransactions.length})
          </h2>
          <span className="text-xs text-slate-400">
            Recorded in Egyptian Pounds (EGP)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">Date & Time</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Description / Reason</th>
                <th className="py-3 px-6">Reference ID</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                    {formatDateDisplay(tx.timestamp.split('T')[0])}
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {tx.timestamp.split('T')[1]?.slice(0, 5)} UTC
                    </span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {getTransactionBadge(tx.type)}
                  </td>

                  <td className="py-4 px-6 max-w-xs">
                    <p className="font-semibold text-slate-900">{tx.description}</p>
                    {tx.reason && (
                      <p className="text-[11px] text-slate-500 mt-0.5">Note: {tx.reason}</p>
                    )}
                  </td>

                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {tx.referenceId || tx.id}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-sm ${
                        tx.amountMinorUnits >= 0 ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {formatSignedEGP(tx.amountMinorUnits)}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-mono font-semibold text-slate-600 whitespace-nowrap">
                    {formatEGP(tx.balanceAfterMinorUnits)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCreditModal
        isOpen={isAddCreditOpen}
        onClose={() => setIsAddCreditOpen(false)}
      />
    </div>
  );
};
