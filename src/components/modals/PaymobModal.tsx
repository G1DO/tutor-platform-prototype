import React, { useState } from 'react';
import { CreditCard, ShieldCheck, AlertCircle, X, CheckCircle, Lock } from 'lucide-react';
import { formatEGP } from '../../utils/currency';

interface PaymobModalProps {
  isOpen: boolean;
  amountMinorUnits: number;
  description: string;
  onSuccess: (referenceId: string) => void;
  onFailure: (reason: string) => void;
  onCancel: () => void;
}

export const PaymobModal: React.FC<PaymobModalProps> = ({
  isOpen,
  amountMinorUnits,
  description,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 1111');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');
  const [cardHolder, setCardHolder] = useState('Omar Mostafa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setStatusMessage('Contacting Paymob payment gateway...');
    setTimeout(() => {
      setStatusMessage('Payment verified successfully!');
      setTimeout(() => {
        setIsProcessing(false);
        const refId = `paymob_ref_${Math.floor(10000000 + Math.random() * 90000000)}`;
        onSuccess(refId);
      }, 700);
    }, 900);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setStatusMessage('Contacting Paymob payment gateway...');
    setTimeout(() => {
      setIsProcessing(false);
      setStatusMessage(null);
      onFailure('Transaction declined by issuing bank (Simulated card test error #51: Insufficient funds).');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paymob-dialog-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 relative">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white">
              Mock Gateway
            </span>
            <span className="text-xs text-blue-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit TLS Simulation
            </span>
          </div>
          <h2 id="paymob-dialog-title" className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-300" />
            Paymob Checkout Simulator
          </h2>
          <p className="text-sm text-blue-100 mt-1">{description}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Amount Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount Due
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                {formatEGP(amountMinorUnits)}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                Simulated Sandbox
              </span>
            </div>
          </div>

          {/* Educational notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong>Simulated sandbox mode:</strong> Do not enter real credit card credentials. Use the demo buttons below to simulate successful payment, bank failure, or cancellation.
            </div>
          </div>

          {/* Mock Card Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                disabled={isProcessing}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={isProcessing}
                  className="w-full text-sm font-mono border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-blue-600">
                  VISA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  disabled={isProcessing}
                  className="w-full text-sm font-mono border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  CVV / CVC
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  disabled={isProcessing}
                  className="w-full text-sm font-mono border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Processing message */}
          {statusMessage && (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold animate-pulse">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {statusMessage}
            </div>
          )}

          {/* Simulator Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Simulate Successful Payment ({formatEGP(amountMinorUnits)})
            </button>

            <button
              type="button"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
            >
              <AlertCircle className="w-4 h-4" />
              Simulate Card Decline / Bank Error
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full py-2 px-4 text-slate-600 hover:text-slate-900 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
