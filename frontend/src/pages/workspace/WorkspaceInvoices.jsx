import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Receipt, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Send,
  Ban
} from 'lucide-react';
import AddInvoiceModal from '../../components/AddInvoiceModal';
import Loader from '../../components/Loader';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { downloadInvoicePdf } from '../../api/invoiceApi';
import { 
  deleteInvoiceAsync, 
  fetchInvoicesAsync, 
  updateInvoiceStatusAsync 
} from '../../redux/slices/invoiceSlice';

const TYPE_FILTERS = ['All', 'Invoice', 'Estimate'];
const STATUS_FILTERS = ['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    case 'Sent':
      return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
    case 'Overdue':
      return 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold';
    case 'Cancelled':
      return 'bg-slate-800 border-slate-700/50 text-slate-400';
    default:
      return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  }
};

export default function WorkspaceInvoices() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { list: invoices, loading } = useSelector((state) => state.invoices);
  const [activeType, setActiveType] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [invToDelete, setInvToDelete] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchInvoicesAsync({
          companyId,
          params: {
            invoiceType: activeType !== 'All' ? activeType : undefined,
            status: activeStatus !== 'All' ? activeStatus : undefined,
            search: searchQuery
          }
        })
      );
    }
  }, [dispatch, companyId, activeType, activeStatus, searchQuery]);

  const handleStatusChange = async (invoiceId, status) => {
    await dispatch(updateInvoiceStatusAsync({ invoiceId, status }));
  };

  const handleDeleteInvoice = async () => {
    if (!invToDelete) return;
    await dispatch(deleteInvoiceAsync(invToDelete._id));
    setInvToDelete(null);
  };

  return (
    <WorkspaceLayout companyName="Company Workspace">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Invoice & Estimate System</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create commercial invoices, export PDFs, track client payment statuses, and generate estimates.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice / Estimate</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {TYPE_FILTERS.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeType === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice # or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Invoice Directory Table */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : invoices.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Invoice #</th>
                <th className="py-3.5 px-4 font-semibold">Client</th>
                <th className="py-3.5 px-4 font-semibold">Type</th>
                <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                <th className="py-3.5 px-4 font-semibold">Due Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{inv.invoiceNumber}</td>

                  <td className="py-3.5 px-4 font-semibold text-white">{inv.clientName}</td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50 text-[10px]">
                      {inv.invoiceType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {inv.currency} {inv.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={inv.invoiceStatus}
                      onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold border bg-slate-950 focus:outline-none ${getStatusBadge(
                        inv.invoiceStatus
                      )}`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => downloadInvoicePdf(inv._id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Download PDF Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setInvToDelete(inv)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Invoices Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create commercial invoices or proforma estimates to manage corporate billing.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      )}

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
      />

      {/* Delete Confirmation Modal */}
      {invToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Invoice Record?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete invoice <span className="text-white font-mono font-semibold">{invToDelete.invoiceNumber}</span>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setInvToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInvoice}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
