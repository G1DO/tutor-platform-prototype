import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { egpToMinorUnits, minorUnitsToEGP, formatEGP } from '../../utils/currency';

export const TutorProfilePage: React.FC = () => {
  const { currentUser, updateTutorProfile, state } = useDemo();

  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [rateEgp, setRateEgp] = useState(
    currentUser?.hourlyRateMinorUnits ? String(minorUnitsToEGP(currentUser.hourlyRateMinorUnits)) : '350'
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    currentUser?.subjects || ['Mathematics', 'Physics']
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!currentUser) return null;

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(rateEgp) || 300;
    updateTutorProfile(currentUser.id, {
      headline: headline.trim(),
      bio: bio.trim(),
      hourlyRateMinorUnits: egpToMinorUnits(rateNum),
      subjects: selectedSubjects,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tutor Profile & Teaching Rates
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your public bio, offered subjects, hourly rate, and review your verification credentials.
        </p>
      </div>

      {/* Application Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs ${
          currentUser.applicationStatus === 'approved'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : currentUser.applicationStatus === 'pending'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        {currentUser.applicationStatus === 'approved' ? (
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <span className="font-bold text-sm block">
            Verification Status: <span className="uppercase">{currentUser.applicationStatus}</span>
          </span>
          <p className="leading-relaxed">
            {currentUser.applicationStatus === 'approved'
              ? 'Your identity documents and degrees have been fully verified by platform administration. Your profile is live in student searches.'
              : currentUser.applicationStatus === 'pending'
              ? 'Your application documents are currently queued for administrator review. You will receive an in-app notification once approved.'
              : `Your application was not approved. Reason: ${currentUser.rejectionReason || 'Please resubmit your academic credentials.'}`}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header with Avatar */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <Avatar
            name={currentUser.name}
            size="lg"
            avatarColor={currentUser.avatarColor}
          />
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500">Tutor Account • {currentUser.email}</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and hourly rates updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Hourly Session Rate (EGP)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                EGP
              </span>
              <input
                type="number"
                min="100"
                step="25"
                value={rateEgp}
                onChange={(e) => setRateEgp(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              10% standard platform commission will be deducted upon session completion.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. PhD in Mathematics | 10+ Years Experience"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Teaching Biography & Qualifications
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Subjects Offered */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Subjects Offered
          </label>
          <div className="flex flex-wrap gap-2">
            {state.settings.supportedSubjects.map((sub) => {
              const isSelected = selectedSubjects.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uploaded Documents View */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Submitted Credentials (Fictional Records)
          </label>
          <div className="space-y-2">
            {currentUser.documents?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">
                      ({doc.fileName} • {doc.fileSize})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Admin Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Tutor Profile
          </button>
        </div>
      </form>
    </div>
  );
};
