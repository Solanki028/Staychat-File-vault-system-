import React from 'react';
import { Settings } from 'lucide-react';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';

export default function WorkspaceSettings() {
  return (
    <WorkspaceLayout companyName="Company Workspace">
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
        <Settings className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-white">Company Workspace Settings</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Configure company profile details, logo branding, tax numbers, and workspace access permissions.
        </p>
      </div>
    </WorkspaceLayout>
  );
}
