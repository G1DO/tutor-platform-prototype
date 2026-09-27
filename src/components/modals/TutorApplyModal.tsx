import React, { useState } from 'react';
import { X, GraduationCap, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { egpToMinorUnits } from '../../utils/currency';

interface TutorApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TutorApplyModal: React.FC<TutorApplyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitTutorApplication, state } = useDemo();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [rateEgp, setRateEgp] = useState('300');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [documents, setDocuments] = useState<Array<{ name: string; type: string; fileName: string; fileSize: string }>>([
    {
      name: 'Degree Certificate / Graduation Diploma',
      type: 'Degree Certificate',
      fileName: 'academic_diploma.pdf',
      fileSize: '2.1 MB',
    },
    {
      name: 'National ID / Passport Verification',
      type: 'Government ID',
      fileName: 'national_id_scan.pdf',
      fileSize: '1.4 MB',
    },
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleMockAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocuments((prev) => [
        ...prev,
        {
          name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          type: 'Additional Credential',
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim()) {
      setErrorMsg('Please complete all contact and account fields.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setErrorMsg('Please select at least one teaching subject.');
      return;
    }
    const rateNum = parseFloat(rateEgp) || 0;
    if (rateNum < 100) {
      setErrorMsg('Minimum recommended rate is EGP 100/hr.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = submitTutorApplication({
      name: name.trim(),
      email: email.trim(),
      username: username.trim().toLowerCase(),
      headline: headline.trim() || 'Experienced Tutor',
      bio: bio.trim() || 'Dedicated educator helping students excel in their academic goals.',
      hourlyRateMinorUnits: egpToMinorUnits(rateNum),
      subjects: selectedSubjects,
      documents,
    });

    setIsSubmitting(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to submit application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutor-apply-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tutor-apply-title" className="text-base font-bold text-white">
                Apply to Become a Tutor
              </h2>
              <p className="text-xs text-slate-400">Join TutorConnect to teach high school & university students</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Hisham Farouk"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hisham@example.com"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Username for Login *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. hisham_math"
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Hourly Session Rate (EGP) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={rateEgp}
                onChange={(e) => setRateEgp(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Master in Pure Mathematics | 8 Years IGCSE Experience"
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Teaching Biography & Experience
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your qualifications, teaching methodology, and student successes..."
              className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subjects Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subjects You Teach (Select all that apply)
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

          {/* Mock Document Attachments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Verification Documents (Prototype Mock Files)
              </label>
              <label className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Add file simulation</span>
                <input
                  type="file"
                  onChange={handleMockAddFile}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Filename-only demo submission. No actual confidential documents are stored on a server.
            </p>

            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="text-slate-400 ml-2 font-mono text-[10px]">
                        ({doc.fileName} • {doc.fileSize})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {doc.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
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
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Tutor Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
