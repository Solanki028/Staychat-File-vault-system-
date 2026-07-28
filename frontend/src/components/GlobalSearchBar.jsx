import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Users, 
  Handshake, 
  Car, 
  Landmark, 
  Receipt, 
  X, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { executeWorkspaceSearch } from '../api/searchApi';

export default function GlobalSearchBar() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 300ms Debounced Search Effect
  useEffect(() => {
    if (!query.trim() || !companyId) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await executeWorkspaceSearch(companyId, query);
        setResults(res.data);
        setIsOpen(true);
      } catch (error) {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, companyId]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const hasResults = results && (
    results.documents?.length > 0 ||
    results.employees?.length > 0 ||
    results.partners?.length > 0 ||
    results.vehicles?.length > 0 ||
    results.bankAccounts?.length > 0 ||
    results.invoices?.length > 0
  );

  return (
    <div ref={containerRef} className="relative w-64 sm:w-80 z-40">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search workspace (Docs, Staff, IBAN)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        {loading ? (
          <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin absolute right-3 top-2.5" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
            }}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown Menu */}
      {isOpen && results && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50 backdrop-blur-xl divide-y divide-slate-800/60 p-2 space-y-2">
          {hasResults ? (
            <>
              {/* Documents */}
              {results.documents?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Documents ({results.documents.length})
                  </div>
                  {results.documents.map((doc) => (
                    <div
                      key={doc._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/documents`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="truncate">{doc.title || doc.originalName}</span>
                      <span className="text-[10px] text-slate-500">{doc.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Employees */}
              {results.employees?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Employees ({results.employees.length})
                  </div>
                  {results.employees.map((emp) => (
                    <div
                      key={emp._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/employees`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-medium text-white">{emp.fullName}</span>
                      <span className="text-[10px] text-slate-400">{emp.department}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Partners */}
              {results.partners?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Handshake className="w-3 h-3" /> Partners ({results.partners.length})
                  </div>
                  {results.partners.map((pt) => (
                    <div
                      key={pt._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/partners`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-medium text-white">{pt.partnerName}</span>
                      <span className="text-[10px] text-amber-400 font-bold">{pt.ownershipPercentage}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicles */}
              {results.vehicles?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Car className="w-3 h-3" /> Fleet Vehicles ({results.vehicles.length})
                  </div>
                  {results.vehicles.map((v) => (
                    <div
                      key={v._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/vehicles`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-mono font-bold text-white">{v.plateNumber}</span>
                      <span className="text-[10px] text-slate-400">{v.make} {v.model}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bank Accounts */}
              {results.bankAccounts?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Landmark className="w-3 h-3" /> Bank Accounts ({results.bankAccounts.length})
                  </div>
                  {results.bankAccounts.map((b) => (
                    <div
                      key={b._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/banking`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-purple-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-medium text-white">{b.bankName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{b.accountNumber}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {results.invoices?.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <Receipt className="w-3 h-3" /> Commercial Invoices ({results.invoices.length})
                  </div>
                  {results.invoices.map((inv) => (
                    <div
                      key={inv._id}
                      onClick={() => handleSelectResult(`/workspace/${companyId}/invoices`)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-mono font-bold text-white">{inv.invoiceNumber}</span>
                      <span className="text-[10px] text-slate-400">{inv.clientName}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No workspace records found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
