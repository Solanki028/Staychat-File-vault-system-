import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Users, 
  Handshake, 
  Car, 
  Landmark, 
  Receipt,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck
} from 'lucide-react';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import Loader from '../../components/Loader';
import { fetchCompaniesAsync } from '../../redux/slices/companySlice';

export default function WorkspaceOverview() {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const { list: companies, loading } = useSelector((state) => state.companies);

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(fetchCompaniesAsync());
    }
  }, [dispatch, companies.length]);

  const company = companies.find((c) => c._id === companyId);

  if (loading && !company) {
    return (
      <WorkspaceLayout companyName="Loading...">
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout companyName={company?.companyName || 'Company Workspace'}>
      {/* Workspace Header Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-indigo-500/25">
              {company?.companyName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{company?.companyName || 'Company Workspace'}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {company?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{company?.industry || 'General Business'} • Reg No: <span className="font-mono text-slate-200">{company?.registrationNumber}</span></p>
            </div>
          </div>
        </div>

        {/* Contact & Address Subdocument Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{company?.contact?.email || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{company?.contact?.phone || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{company?.address?.street}, {company?.address?.city}, {company?.address?.country}</span>
          </div>
        </div>
      </div>

      {/* Module Overview Quick Cards */}
      <h2 className="text-sm font-semibold text-slate-300 mb-4">Workspace Modules Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Documents</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-white">0</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Employees</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg font-bold text-white">0</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Partners</span>
            <Handshake className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white">0</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Vehicles</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white">0</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
