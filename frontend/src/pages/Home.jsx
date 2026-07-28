import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  Users, 
  Plus, 
  ArrowRight, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import AddCompanyModal from '../components/AddCompanyModal';
import DashboardLayout from '../layouts/DashboardLayout';
import Loader from '../components/Loader';
import { deleteCompanyAsync, fetchCompaniesAsync } from '../redux/slices/companySlice';

export default function Home() {
  const dispatch = useDispatch();
  const { list: companies, loading, pagination } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCompaniesAsync({ search: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    await dispatch(deleteCompanyAsync(companyToDelete._id));
    setCompanyToDelete(null);
  };

  return (
    <DashboardLayout>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.fullName || 'Business Owner'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your organizations, company workspaces, and secure document vaults.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Companies</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{pagination.totalItems || companies.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Documents</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">--</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Expiring Licenses</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-400">0</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Employees</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">--</p>
        </div>
      </div>

      {/* Companies Grid Section */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Company Workspaces</h2>
            <p className="text-xs text-slate-400">Select a company to open its isolated operational workspace.</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader />
          </div>
        ) : companies.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <div
                key={company._id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 backdrop-blur-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                        {company.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                          {company.companyName}
                        </h3>
                        <p className="text-[11px] text-slate-400">{company.industry}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 my-4 border-t border-b border-slate-800/60 py-3">
                    <div className="flex justify-between">
                      <span>Reg No:</span>
                      <span className="font-mono text-slate-200">{company.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="text-slate-200">{company.contact?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-slate-200">{company.address?.city}, {company.address?.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/workspace/${company._id}`}
                    className="flex-1 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setCompanyToDelete(company)}
                    className="p-2 bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 rounded-lg transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Companies Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first company workspace to start managing documents, employees, vehicles, and invoices.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
        )}
      </section>

      {/* Add Company Modal */}
      <AddCompanyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Delete Confirmation Modal */}
      {companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Company Workspace?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete <span className="text-white font-semibold">{companyToDelete.companyName}</span>? This action soft-deletes the workspace.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCompanyToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCompany}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
