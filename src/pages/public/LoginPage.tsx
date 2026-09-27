import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { TutorApplyModal } from '../../components/modals/TutorApplyModal';

export const LoginPage: React.FC = () => {
  const { login, registerStudent } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('student');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('student');
  const [regGoals, setRegGoals] = useState('Prepare for IGCSE/Thanaweya exams');
  const [isTutorApplyOpen, setIsTutorApplyOpen] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = login(username, password);
    if (res.success && res.user) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'tutor') navigate('/tutor/dashboard');
      else navigate('/student/dashboard');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (userRole: 'student' | 'tutor' | 'admin') => {
    setErrorMsg(null);
    let u = 'user';
    let p = 'student';

    if (userRole === 'admin') {
      u = 'admin';
      p = 'admin';
    } else if (userRole === 'tutor') {
      u = 'tutor';
      p = 'tutor';
    }

    setUsername(u);
    setPassword(p);

    const res = login(u, p);
    if (res.success && res.user) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'tutor') navigate('/tutor/dashboard');
      else navigate('/student/dashboard');
    } else {
      setErrorMsg(res.error || 'Quick login failed.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regUsername.trim()) {
      setErrorMsg('Please complete all required registration fields.');
      return;
    }

    const res = registerStudent({
      name: regName.trim(),
      email: regEmail.trim(),
      username: regUsername.trim(),
      password: regPassword || 'student',
      learningGoals: regGoals,
    });

    if (res.success && res.user) {
      navigate('/student/dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Tutor<span className="text-indigo-600">Connect</span>
          </h1>
          <p className="text-xs text-slate-500">
            Experience role-based journeys for Students, Tutors, and Administrators
          </p>
        </div>

        {/* Demo Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Simulated Authentication:</strong> Browser-local credentials. Switch between roles anytime without wiping shared session data.
          </span>
        </div>

        {/* Quick Login Buttons (Top Requirement) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            One-Click Demo Quick Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 group"
            >
              <BookOpen className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Student</span>
              <span className="text-[10px] text-indigo-700/70 font-mono">user / student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('tutor')}
              className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 group"
            >
              <GraduationCap className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Tutor</span>
              <span className="text-[10px] text-blue-700/70 font-mono">tutor / tutor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 group"
            >
              <Shield className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Admin</span>
              <span className="text-[10px] text-emerald-700/70 font-mono">admin / admin</span>
            </button>
          </div>
        </div>

        {/* Credentials Reference Table */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
          <span className="font-bold text-slate-700 block mb-2">Requested Demo Credentials:</span>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1">Role</th>
                  <th className="py-1">Username</th>
                  <th className="py-1">Password</th>
                  <th className="py-1 text-right">Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-1 font-sans font-semibold text-emerald-700">Admin</td>
                  <td className="py-1 font-bold">admin</td>
                  <td className="py-1">admin</td>
                  <td className="py-1 text-right font-sans text-slate-500">/admin/dashboard</td>
                </tr>
                <tr>
                  <td className="py-1 font-sans font-semibold text-indigo-700">Student</td>
                  <td className="py-1 font-bold">user</td>
                  <td className="py-1">student</td>
                  <td className="py-1 text-right font-sans text-slate-500">/student/dashboard</td>
                </tr>
                <tr>
                  <td className="py-1 font-sans font-semibold text-blue-700">Tutor</td>
                  <td className="py-1 font-bold">tutor</td>
                  <td className="py-1">tutor</td>
                  <td className="py-1 text-right font-sans text-slate-500">/tutor/dashboard</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Login or Register Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In with Credentials
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New Student Signup
            </button>
          </div>

          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin / user / tutor"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="admin / student / tutor"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Mariam Soliman"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="mariam@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="mariam_s"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Learning Goals
                  </label>
                  <input
                    type="text"
                    value={regGoals}
                    onChange={(e) => setRegGoals(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                  🎁 New accounts receive a complimentary EGP 500 demo platform credit on signup!
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  Create Student Account & Enter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Want to teach? Apply modal trigger */}
        <div className="text-center text-xs text-slate-500">
          Want to offer tutoring services?{' '}
          <button
            type="button"
            onClick={() => setIsTutorApplyOpen(true)}
            className="font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
          >
            Apply to become a tutor
          </button>
        </div>
      </div>

      <TutorApplyModal
        isOpen={isTutorApplyOpen}
        onClose={() => setIsTutorApplyOpen(false)}
      />
    </div>
  );
};
