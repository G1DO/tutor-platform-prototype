import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { egpToMinorUnits, formatEGP } from '../../utils/currency';

interface StudentCreditAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentCreditAdjustmentModal: React.FC<StudentCreditAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { state, adminAdjustCredit, getStudentBalance } = useDemo();

  const students = state.users.filter((u) => u.role === 'student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [direction, setDirection] = useState<'add' | 'deduct'>('add');
  const [amountEgp, setAmountEgp] = useState<string>('200');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentBal = selectedStudentId ? getStudentBalance(selectedStudentId) : 0;
  const numEgp = parseFloat(amountEgp) || 0;
  const rawMinorUnits = egpToMinorUnits(numEgp);
  const finalMinorUnits = direction === 'add' ? rawMinorUnits : -rawMinorUnits;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setErrorMsg('Please select a student.');
      return;
    }
    if (numEgp <= 0) {
      setErrorMsg('Please enter a positive amount in EGP.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('A specific business or audit reason is strictly mandatory for financial adjustments.');
      return;
    }
    if (direction === 'deduct' && currentBal < rawMinorUnits) {
      setErrorMsg(`Cannot deduct ${formatEGP(rawMinorUnits)}: student balance is only ${formatEGP(currentBal)}.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = adminAdjustCredit(selectedStudentId, finalMinorUnits, reason.trim());
    setIsSubmitting(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to adjust student credit.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adj-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="adj-modal-title" className="text-base font-bold text-white">
                Admin Balance Adjustment
              </h2>
              <p className="text-xs text-slate-400">Audited financial intervention</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.username}) — Current Bal: {formatEGP(getStudentBalance(s.id))}
                </option>
              ))}
            </select>
          </div>

          {/* Direction toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('add')}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition-colors cursor-pointer ${
                  direction === 'add'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                + Add Credit (Credit Bonus/Comp)
              </button>
              <button
                type="button"
                onClick={() => setDirection('deduct')}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition-colors cursor-pointer ${
                  direction === 'deduct'
                    ? 'bg-rose-50 border-rose-600 text-rose-800 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                - Deduct Credit (Correction/Penalty)
              </button>
            </div>
          </div>

          {/* Amount in EGP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Amount (EGP)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                EGP
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amountEgp}
                onChange={(e) => setAmountEgp(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
                required
              />
            </div>
          </div>

          {/* Mandatory reason */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Mandatory Reason / Audit Note *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Compensation for tutor cancellation with short notice, or chargeback correction."
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Impact preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Current Balance:</span>
              <span className="font-semibold">{formatEGP(currentBal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Adjustment:</span>
              <span
                className={`font-bold ${
                  direction === 'add' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {direction === 'add' ? '+' : '-'}
                {formatEGP(rawMinorUnits)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Balance After:</span>
              <span>{formatEGP(currentBal + finalMinorUnits)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim() || numEgp <= 0}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {isSubmitting ? 'Recording Adjustment...' : 'Record Adjustment in Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
