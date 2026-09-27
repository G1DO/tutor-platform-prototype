import React, { useState } from 'react';
import { X, Wallet, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatEGP, egpToMinorUnits } from '../../utils/currency';
import { PaymobModal } from './PaymobModal';

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddCreditModal: React.FC<AddCreditModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, addCredit } = useDemo();
  const [selectedEgp, setSelectedEgp] = useState<number>(500);
  const [customEgp, setCustomEgp] = useState<string>('');
  const [isPaymobOpen, setIsPaymobOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAmountEgp = customEgp ? parseFloat(customEgp) || 0 : selectedEgp;
  const amountMinorUnits = egpToMinorUnits(currentAmountEgp);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmountEgp < 50) {
      setErrorMsg('Minimum top-up amount is EGP 50.');
      return;
    }
    if (currentAmountEgp > 10000) {
      setErrorMsg('Maximum demo top-up amount is EGP 10,000.');
      return;
    }
    setErrorMsg(null);
    setIsPaymobOpen(true);
  };

  const handlePaymobSuccess = (refId: string) => {
    setIsPaymobOpen(false);
    if (!currentUser) return;

    const res = addCredit(currentUser.id, amountMinorUnits, refId);
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to credit account.');
    }
  };

  const handlePaymobFailure = (reason: string) => {
    setIsPaymobOpen(false);
    setErrorMsg(`Paymob top-up failed: ${reason}`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-credit-title"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                <Wallet className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 id="add-credit-title" className="text-base font-bold text-white">
                  Add Platform Credit
                </h2>
                <p className="text-xs text-slate-400">Auditable wallet top-up via Paymob</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleStartPayment} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[200, 500, 1000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setSelectedEgp(amt);
                      setCustomEgp('');
                    }}
                    className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !customEgp && selectedEgp === amt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    EGP {amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Or Enter Custom Amount (EGP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                  EGP
                </span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={customEgp}
                  onChange={(e) => setCustomEgp(e.target.value)}
                  placeholder="e.g. 750"
                  className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Credits can be used for any tutor bookings and are fully refundable if cancelled before start time.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Total to Charge:</span>
              <span className="text-base font-extrabold text-indigo-700">
                {formatEGP(amountMinorUnits)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={currentAmountEgp < 50}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout ({formatEGP(amountMinorUnits)})
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <PaymobModal
        isOpen={isPaymobOpen}
        amountMinorUnits={amountMinorUnits}
        description={`Platform Credit Top-up for ${currentUser?.name || 'Student'}`}
        onSuccess={handlePaymobSuccess}
        onFailure={handlePaymobFailure}
        onCancel={() => setIsPaymobOpen(false)}
      />
    </>
  );
};
