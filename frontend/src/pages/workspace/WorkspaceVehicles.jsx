import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Car, 
  Plus, 
  Search, 
  AlertTriangle, 
  Trash2, 
  Calendar,
  ShieldAlert,
  Clock
} from 'lucide-react';
import AddVehicleModal from '../../components/AddVehicleModal';
import Loader from '../../components/Loader';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { 
  deleteVehicleAsync, 
  fetchExpiringVehiclesAsync, 
  fetchVehiclesAsync 
} from '../../redux/slices/vehicleSlice';

const STATUS_FILTERS = ['All', 'Active', 'Maintenance', 'Decommissioned'];

const getExpiryBadge = (expiryDateStr) => {
  if (!expiryDateStr) return { text: 'N/A', style: 'bg-slate-800 text-slate-400' };

  const expiry = new Date(expiryDateStr);
  const today = new Date();
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Expired (${Math.abs(diffDays)}d ago)`, style: 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold' };
  } else if (diffDays <= 30) {
    return { text: `Expiring (${diffDays}d left)`, style: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-semibold' };
  } else {
    return { text: `Valid (${diffDays}d left)`, style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  }
};

export default function WorkspaceVehicles() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { list: vehicles, expiringList, loading } = useSelector((state) => state.vehicles);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchVehiclesAsync({
          companyId,
          params: {
            status: activeStatus !== 'All' ? activeStatus : undefined,
            search: searchQuery
          }
        })
      );
      dispatch(fetchExpiringVehiclesAsync(companyId));
    }
  }, [dispatch, companyId, activeStatus, searchQuery]);

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    await dispatch(deleteVehicleAsync(vehicleToDelete._id));
    setVehicleToDelete(null);
  };

  return (
    <WorkspaceLayout companyName="Company Workspace">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Vehicle Fleet Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor company vehicles, assigned drivers, mulkiya registration and insurance renewal deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Expiry Warning Alert Banner */}
      {expiringList.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-amber-300">
              Fleet Renewal Notice ({expiringList.length} Vehicle{expiringList.length > 1 ? 's' : ''})
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Registration or insurance renewals are required within 30 days for:{' '}
              <span className="font-mono font-semibold text-white">
                {expiringList.map((v) => `${v.plateNumber} (${v.make} ${v.model})`).join(', ')}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeStatus === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by plate, make, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Vehicle Directory Table */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : vehicles.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Plate & Vehicle</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Driver</th>
                <th className="py-3.5 px-4 font-semibold">Reg Expiry</th>
                <th className="py-3.5 px-4 font-semibold">Insurance Expiry</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehicles.map((v) => {
                const regBadge = getExpiryBadge(v.registrationExpiry);
                const insBadge = getExpiryBadge(v.insuranceExpiry);

                return (
                  <tr key={v._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-white tracking-wide">{v.plateNumber}</p>
                          <p className="text-[10px] text-slate-400">{v.year} {v.make} {v.model}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200">{v.assignedDriver}</td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] inline-block ${regBadge.style}`}>
                        {regBadge.text}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] inline-block ${insBadge.style}`}>
                        {insBadge.text}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          v.vehicleStatus === 'Active'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : v.vehicleStatus === 'Maintenance'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        {v.vehicleStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setVehicleToDelete(v)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Car className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Vehicles Registered</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Register company fleet vehicles to track mulkiya expiration and insurance renewals.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
      />

      {/* Delete Confirmation Modal */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Vehicle Record?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete vehicle <span className="text-white font-mono font-semibold">{vehicleToDelete.plateNumber}</span>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVehicle}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
