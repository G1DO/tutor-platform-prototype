import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-900">
                Tutor<span className="text-indigo-600">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              A modern tutoring marketplace prototype connecting high-school and university students across Egypt with qualified private tutors in STEM, languages, and coding.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Demonstration Prototype Notice:</span> All user profiles, financial balances, Paymob checkouts, and Zoom classrooms are client-side simulations. Money is represented in integer minor units (EGP).
            </div>
          </div>

          {/* Quick Demo Access */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 mb-3">
              Demo Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/student/dashboard" className="hover:text-indigo-600 transition-colors">
                  Student Portal (user / student)
                </Link>
              </li>
              <li>
                <Link to="/tutor/dashboard" className="hover:text-indigo-600 transition-colors">
                  Tutor Portal (tutor / tutor)
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-indigo-600 transition-colors">
                  Admin Console (admin / admin)
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="hover:text-indigo-600 transition-colors">
                  Tutor Discovery Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Prototype Business Rules */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 mb-3">
              Prototype Assumptions
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500">
              <li>• Session duration: 60 minutes</li>
              <li>• Default platform commission: 10%</li>
              <li>• Immutable financial ledger</li>
              <li>• Cancellations refund to platform credit</li>
              <li>• Free rescheduling with same tutor</li>
              <li>• Egyptian Pound (EGP) currency</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© 2026 TutorConnect Prototype. Built for client offer evaluation.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
