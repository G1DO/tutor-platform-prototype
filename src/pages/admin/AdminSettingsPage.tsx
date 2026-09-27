import React, { useState } from 'react';
import {
  Settings,
  Percent,
  BookOpen,
  RotateCcw,
  CheckCircle,
  Plus,
  Trash2,
  Save,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { ResetDemoModal } from '../../components/modals/ResetDemoModal';

export const AdminSettingsPage: React.FC = () => {
  const { state, adminUpdateSettings, resetDemoData } = useDemo();

  const [platformName, setPlatformName] = useState(state.settings.platformName);
  const [commissionRate, setCommissionRate] = useState(
    state.settings.commissionRatePercent.toString()
  );
  const [subjects, setSubjects] = useState<string[]>(state.settings.supportedSubjects);
  const [newSubject, setNewSubject] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) return;
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(commissionRate) || 10;
    adminUpdateSettings({
      platformName: platformName.trim(),
      commissionRatePercent: rateNum,
      supportedSubjects: subjects,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure platform branding, default commission percentage, catalog subjects, and demo data reset.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Platform settings updated successfully! Event recorded in audit trail.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
          <Settings className="w-5 h-5 text-indigo-600" />
          General Platform Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Platform Name
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Default Platform Commission (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Applied automatically when bookings are created.
            </p>
          </div>
        </div>

        {/* Snapshot Rule Notice */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Snapshot Integrity Rule:</strong> When a booking is created, its session price and platform commission rate are permanently snapshotted. Changing the commission percentage here will affect only future bookings without rewriting historical records.
          </span>
        </div>

        {/* Fixed Demo Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Standard Currency:</span>
            <p className="font-bold text-slate-800">
              {state.settings.defaultCurrency} (Egyptian Pound) • Minor Unit = Piastre
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Platform Timezone:</span>
            <p className="font-bold text-slate-800">{state.settings.timezone}</p>
          </div>
        </div>

        {/* Supported Subjects Manager */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Curriculum & Subject Catalog ({subjects.length})
          </label>

          <div className="flex flex-wrap gap-2 mb-3">
            {subjects.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
              >
                {sub}
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(sub)}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  title={`Remove ${sub}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add new subject (e.g. Statistics)"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Demo Data */}
      <div className="bg-rose-50/60 rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold">Prototype Data Reset</h3>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed max-w-2xl">
          Resetting clears all custom bookings, ledger transactions, and reviews made in this browser and restores the default starting dataset, including the three demo accounts with their initial balances.
        </p>
        <button
          type="button"
          onClick={() => setIsResetOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data to Initial State
        </button>
      </div>

      <ResetDemoModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={resetDemoData}
      />
    </div>
  );
};
