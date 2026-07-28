import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Handshake, 
  Plus, 
  PieChart, 
  Trash2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import AddPartnerModal from '../../components/AddPartnerModal';
import Loader from '../../components/Loader';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { 
  deletePartnerAsync, 
  fetchPartnersAsync 
} from '../../redux/slices/partnerSlice';

export default function WorkspacePartners() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { list: partners, totalOwnershipPercentage, availablePercentage, loading } = useSelector((state) => state.partners);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchPartnersAsync(companyId));
    }
  }, [dispatch, companyId]);

  const handleDeletePartner = async () => {
    if (!partnerToDelete) return;
    await dispatch(deletePartnerAsync(partnerToDelete._id));
    setPartnerToDelete(null);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Managing Partner':
        return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'Silent Partner':
        return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
      default:
        return 'bg-slate-800 border-slate-700/50 text-slate-300';
    }
  };

  return (
    <WorkspaceLayout companyName="Company Workspace">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Partner & Shareholder Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage partner records and track company equity allocation (capped at 100.00%).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={availablePercentage <= 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Equity Allocation Progress Widget */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Company Equity Allocation</h2>
          </div>
          <div className="text-xs">
            <span className="font-bold text-indigo-400">{totalOwnershipPercentage.toFixed(2)}%</span>
            <span className="text-slate-500"> / 100.00% Allocated</span>
            <span className="text-slate-400 ml-2">({availablePercentage.toFixed(2)}% Available)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${Math.min(totalOwnershipPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Partners Cards Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : partners.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 backdrop-blur-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                      {partner.partnerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {partner.partnerName}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border mt-1 ${getRoleBadge(partner.role)}`}>
                        {partner.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-indigo-400">{partner.ownershipPercentage.toFixed(2)}%</span>
                    <p className="text-[10px] text-slate-500 uppercase">Share</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 my-4 border-t border-b border-slate-800/60 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-slate-300 truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-300">{partner.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">Joined: {new Date(partner.joiningDate).toLocaleDateString()}</span>

                <button
                  onClick={() => setPartnerToDelete(partner)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Partner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Handshake className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Partners Registered</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add company partners and shareholders to manage equity share allocations.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner</span>
          </button>
        </div>
      )}

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
        availablePercentage={availablePercentage}
      />

      {/* Delete Confirmation Modal */}
      {partnerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Partner Record?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete <span className="text-white font-semibold">{partnerToDelete.partnerName}</span> ({partnerToDelete.ownershipPercentage.toFixed(2)}%)?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPartnerToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePartner}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
