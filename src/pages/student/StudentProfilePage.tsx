import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, BookOpen, Target, CheckCircle, Save } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateStudentProfile, state } = useDemo();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+20 102 345 6789');
  const [learningGoals, setLearningGoals] = useState(currentUser?.learningGoals || '');
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>(
    currentUser?.preferredSubjects || ['Mathematics', 'Physics']
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!currentUser) return null;

  const toggleSubject = (sub: string) => {
    if (preferredSubjects.includes(sub)) {
      setPreferredSubjects(preferredSubjects.filter((s) => s !== sub));
    } else {
      setPreferredSubjects([...preferredSubjects, sub]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(currentUser.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      learningGoals: learningGoals.trim(),
      preferredSubjects,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Profile & Learning Goals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your profile and academic goals to get personalized tutor recommendations.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Avatar header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <Avatar
            name={name || currentUser.name}
            size="lg"
            avatarColor={currentUser.avatarColor}
          />
          <div>
            <h2 className="text-base font-bold text-slate-900">{name || currentUser.name}</h2>
            <p className="text-xs text-slate-500">Student Account • ID: {currentUser.id}</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved successfully! Data persists in localStorage.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Phone Number (for SMS Lesson Reminders)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Learning Goals & Objectives
          </label>
          <textarea
            rows={3}
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            placeholder="e.g. Master calculus and advance Python programming for university entrance exams."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Preferred Subjects
          </label>
          <div className="flex flex-wrap gap-2">
            {state.settings.supportedSubjects.map((sub) => {
              const isSelected = preferredSubjects.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
