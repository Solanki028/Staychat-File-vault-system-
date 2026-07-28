import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, X } from 'lucide-react';
import { fetchCompanyAuditLogs } from '../api/auditLogApi';

export default function AuditLogModal({ isOpen, onClose, companyId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && companyId) {
      setLoading(true);
      fetchCompanyAuditLogs(companyId)
        .then((res) => setLogs(res.data || []))
        .catch(() => setLogs([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System Audit & Compliance Log</h2>
              <p className="text-[11px] text-slate-400">Activity timeline of all workspace operations and security events.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Log Feed */}
        <div className="pt-4 overflow-y-auto pr-1 flex-1 space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading activity timeline...</div>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <div key={log._id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    User: <span className="text-slate-300 font-medium">{log.userEmail}</span> • Module:{' '}
                    <span className="text-indigo-400 font-medium">{log.module}</span>
                  </p>
                  {log.details && <p className="text-[10px] text-slate-500 mt-1 italic">{log.details}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">No activity logs recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
