import React, { useState } from 'react';
import { Shield, Clock, Search, Filter, FileText } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { formatDateDisplay } from '../../utils/date';
import { Badge } from '../../components/common/Badge';

export const AdminActivityLogPage: React.FC = () => {
  const { state } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');

  const logs = [...state.auditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.action.toLowerCase().includes(q) ||
      l.actorName.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.targetId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Administrative Activity & Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Immutable system log capturing actor, timestamp, rationale, and targeted entities for platform security.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action, or target ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredLogs.length} audit event(s)
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Actor</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Target Record</th>
                <th className="py-3 px-6">Event Details & Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {formatDateDisplay(log.timestamp.split('T')[0])}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400">
                        {log.timestamp.split('T')[1]?.slice(0, 8)} UTC
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{log.actorName}</span>
                      <span className="text-[11px] text-slate-400 capitalize">
                        Role: {log.actorRole}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="capitalize font-semibold text-indigo-700">
                        {log.targetType}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400">
                        #{log.targetId}
                      </span>
                    </td>

                    <td className="py-4 px-6 max-w-md">
                      <p className="text-slate-800 leading-relaxed">{log.details}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
