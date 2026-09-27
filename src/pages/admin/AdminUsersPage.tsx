import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Calendar,
  Wallet,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { User, Role } from '../../types';
import { formatEGP } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/date';

export const AdminUsersPage: React.FC = () => {
  const { state, adminUpdateUserStatus, getStudentBalance } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'tutor' | 'admin'>('all');
  const [inspectUser, setInspectUser] = useState<User | null>(null);

  // Status toggle state
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [statusReason, setStatusReason] = useState('Administrative compliance review');

  const filteredUsers = state.users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleConfirmStatusToggle = () => {
    if (!statusTarget) return;
    const newStatus = statusTarget.status === 'active' ? 'suspended' : 'active';
    adminUpdateUserStatus(statusTarget.id, newStatus, statusReason);
    setStatusTarget(null);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          User Management Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Inspect student and tutor profiles, monitor account status, and apply suspensions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          {(['all', 'student', 'tutor', 'admin'] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                roleFilter === r
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Details / Financials</th>
                <th className="py-3 px-6">Created Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="md" avatarColor={user.avatarColor} />
                      <div>
                        <span className="font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          @{user.username} • {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="capitalize font-semibold text-slate-700">{user.role}</span>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <Badge variant={user.status}>{user.status}</Badge>
                  </td>

                  <td className="py-4 px-6">
                    {user.role === 'student' && (
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Balance: {formatEGP(getStudentBalance(user.id))}
                      </span>
                    )}
                    {user.role === 'tutor' && (
                      <span className="text-slate-600">
                        {user.subjects?.join(', ')} • {formatEGP(user.hourlyRateMinorUnits || 30000)}/hr
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="text-emerald-700 font-medium">Administrator</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                    {formatDateDisplay(user.createdAt.split('T')[0])}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectUser(user)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Inspect User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {user.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => setStatusTarget(user)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                            user.status === 'active'
                              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect User Modal */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar name={inspectUser.name} size="md" avatarColor={inspectUser.avatarColor} />
                <div>
                  <h3 className="font-bold text-slate-900">{inspectUser.name}</h3>
                  <span className="text-xs text-slate-500">
                    @{inspectUser.username} • Role: {inspectUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium">Email:</span>
                  <p className="font-semibold text-slate-800">{inspectUser.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Status:</span>
                  <p className="font-semibold text-slate-800 capitalize">{inspectUser.status}</p>
                </div>
              </div>

              {inspectUser.role === 'student' && (
                <div className="space-y-2">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <span className="font-bold text-indigo-900">Platform Credit Balance:</span>
                    <p className="text-base font-black text-indigo-700 mt-0.5">
                      {formatEGP(getStudentBalance(inspectUser.id))}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Learning Goals:</span>
                    <p className="text-slate-600 mt-0.5">{inspectUser.learningGoals || 'None stated'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Preferred Subjects:</span>
                    <p className="text-slate-600 mt-0.5">
                      {inspectUser.preferredSubjects?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {inspectUser.role === 'tutor' && (
                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-slate-700">Hourly Rate:</span>
                    <p className="font-bold text-slate-900">
                      {formatEGP(inspectUser.hourlyRateMinorUnits || 30000)} / hr
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Headline & Bio:</span>
                    <p className="text-slate-600 mt-0.5">{inspectUser.headline}</p>
                    <p className="text-slate-600 mt-1 italic leading-relaxed">{inspectUser.bio}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Attached Documents:</span>
                    <div className="space-y-1 mt-1">
                      {inspectUser.documents?.map((d) => (
                        <div key={d.id} className="p-2 bg-slate-50 rounded-lg flex justify-between">
                          <span>{d.name}</span>
                          <span className="font-mono text-slate-400">{d.fileName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Modal */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {statusTarget.status === 'active' ? 'Suspend User Account?' : 'Reactivate User Account?'}
            </h3>
            <p className="text-xs text-slate-600">
              Target: <strong>{statusTarget.name}</strong> (@{statusTarget.username}, {statusTarget.role})
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason for status change *
              </label>
              <textarea
                rows={2}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusToggle}
                className={`px-4 py-2 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer ${
                  statusTarget.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {statusTarget.status === 'active' ? 'Suspension' : 'Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
