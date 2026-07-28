import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Landmark, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle,
  CreditCard,
  Building
} from 'lucide-react';
import AddBankModal from '../../components/AddBankModal';
import Loader from '../../components/Loader';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { 
  deleteBankAccountAsync, 
  fetchBankAccountsAsync, 
  setPrimaryAccountAsync 
} from '../../redux/slices/bankSlice';

export default function WorkspaceBanking() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { list: bankAccounts, loading } = useSelector((state) => state.bank);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchBankAccountsAsync(companyId));
    }
  }, [dispatch, companyId]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetPrimary = async (bankId) => {
    await dispatch(setPrimaryAccountAsync(bankId));
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    await dispatch(deleteBankAccountAsync(accountToDelete._id));
    setAccountToDelete(null);
  };

  return (
    <WorkspaceLayout companyName="Company Workspace">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Banking & Financial Accounts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage company bank details, IBAN/SWIFT records, and official bank verification letters.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bank Account</span>
        </button>
      </div>

      {/* Bank Accounts Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : bankAccounts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {bankAccounts.map((acc) => (
            <div
              key={acc._id}
              className={`p-6 rounded-2xl bg-slate-900/60 border backdrop-blur-xl transition-all flex flex-col justify-between relative overflow-hidden group ${
                acc.isPrimary ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Primary Ribbon Badge */}
              {acc.isPrimary && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Primary Operating</span>
                </div>
              )}

              <div>
                {/* Top Section */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg shrink-0">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {acc.bankName}
                    </h3>
                    <p className="text-xs text-slate-400">{acc.accountTitle}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/50 text-[10px] font-mono font-bold text-indigo-400">
                      {acc.currency}
                    </span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-2 text-xs bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 my-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-200">
                      <span>{acc.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, `acc-${acc._id}`)}
                        className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                        title="Copy Account Number"
                      >
                        {copiedId === `acc-${acc._id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">IBAN:</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-200">
                      <span className="truncate max-w-[200px]">{acc.iban}</span>
                      <button
                        onClick={() => handleCopy(acc.iban, `iban-${acc._id}`)}
                        className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                        title="Copy IBAN"
                      >
                        {copiedId === `iban-${acc._id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">SWIFT / BIC:</span>
                    <span className="font-mono text-slate-200">{acc.swiftCode}</span>
                  </div>

                  {acc.branchName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Branch:</span>
                      <span className="text-slate-200">{acc.branchName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                {!acc.isPrimary ? (
                  <button
                    onClick={() => handleSetPrimary(acc._id)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Make Primary Operating
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Default for Invoicing
                  </span>
                )}

                <button
                  onClick={() => setAccountToDelete(acc)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Bank Accounts Registered</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add company bank accounts, IBANs, and SWIFT codes for corporate transactions and invoicing.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bank Account</span>
          </button>
        </div>
      )}

      {/* Add Bank Account Modal */}
      <AddBankModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
      />

      {/* Delete Confirmation Modal */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Bank Account?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete <span className="text-white font-semibold">{accountToDelete.bankName}</span> ({accountToDelete.accountNumber})?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
