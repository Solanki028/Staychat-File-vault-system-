import React from 'react';
import { Receipt } from 'lucide-react';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';

export default function WorkspaceInvoices() {
  return (
    <WorkspaceLayout companyName="Company Workspace">
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
        <Receipt className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-white">Invoice & Estimate System</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Generate professional invoices and estimates, configure header/footer settings, and export PDF files.
        </p>
        <span className="inline-block mt-4 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[11px]">
          Scheduled for Phase 10
        </span>
      </div>
    </WorkspaceLayout>
  );
}
