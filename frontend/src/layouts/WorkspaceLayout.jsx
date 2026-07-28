import React, { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Users, 
  Handshake, 
  Car, 
  Landmark, 
  Receipt, 
  Settings, 
  ArrowLeft,
  ShieldCheck,
  Activity
} from 'lucide-react';
import GlobalSearchBar from '../components/GlobalSearchBar';
import NotificationBell from '../components/NotificationBell';
import AuditLogModal from '../components/AuditLogModal';

export default function WorkspaceLayout({ children, companyName = "Company Workspace" }) {
  const { companyId } = useParams();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: `/workspace/${companyId}`, icon: Building2 },
    { name: 'Documents', path: `/workspace/${companyId}/documents`, icon: FileText },
    { name: 'Employees', path: `/workspace/${companyId}/employees`, icon: Users },
    { name: 'Partners', path: `/workspace/${companyId}/partners`, icon: Handshake },
    { name: 'Vehicles', path: `/workspace/${companyId}/vehicles`, icon: Car },
    { name: 'Banking', path: `/workspace/${companyId}/banking`, icon: Landmark },
    { name: 'Invoices', path: `/workspace/${companyId}/invoices`, icon: Receipt },
    { name: 'Settings', path: `/workspace/${companyId}/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans relative overflow-x-hidden">
      {/* Background Ambient Orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col z-20 shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
              {companyName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-semibold text-sm text-white truncate">{companyName}</h2>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Sub-module Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.name === 'Overview'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          {/* Debounced Global Search Engine */}
          <GlobalSearchBar />

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              title="Audit Log"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audit Logs</span>
            </button>
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        companyId={companyId}
      />
    </div>
  );
}
