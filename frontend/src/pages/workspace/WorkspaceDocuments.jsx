import React from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import AllFiles from '../AllFiles';

export default function WorkspaceDocuments() {
  const { companyId } = useParams();

  return (
    <WorkspaceLayout companyName="Company Workspace">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Document Vault</h2>
        <p className="text-xs text-slate-400">Secure document management, file previews, and metadata tracking.</p>
      </div>

      <AllFiles companyId={companyId} />
    </WorkspaceLayout>
  );
}
