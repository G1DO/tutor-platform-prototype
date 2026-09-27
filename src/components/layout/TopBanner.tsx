import React, { useState } from 'react';
import { AlertCircle, RotateCcw, UserCheck, Shield, BookOpen, GraduationCap } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { ResetDemoModal } from '../modals/ResetDemoModal';
import { Role } from '../../types';

export const TopBanner: React.FC = () => {
  const { currentRole, switchUser, resetDemoData, currentUser } = useDemo();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-slate-200 text-xs px-3 sm:px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Notice */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              <AlertCircle className="w-3 h-3" />
              Demo Prototype
            </span>
            <span className="text-slate-300 font-medium">
              Fictional data and simulated payments (EGP).
            </span>
          </div>

          {/* Right: Quick Role Switcher + Reset Action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">
                Switch Role:
              </span>
              <button
                type="button"
                onClick={() => switchUser('student')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'student' && currentUser?.username === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Log in as demo student (user / student)"
              >
                <BookOpen className="w-3 h-3" />
                Student
              </button>
              <button
                type="button"
                onClick={() => switchUser('tutor')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'tutor' && currentUser?.username === 'tutor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Log in as demo tutor (tutor / tutor)"
              >
                <GraduationCap className="w-3 h-3" />
                Tutor
              </button>
              <button
                type="button"
                onClick={() => switchUser('admin')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Log in as demo admin (admin / admin)"
              >
                <Shield className="w-3 h-3" />
                Admin
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="text-slate-400 hover:text-rose-400 hover:bg-slate-800 px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              title="Reset all demo data and restore initial seed"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetDemoData}
      />
    </>
  );
};
