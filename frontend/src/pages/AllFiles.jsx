import {
  ArrowLeft,
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FileCard from '../components/FileCard.jsx';
import Loader from '../components/Loader.jsx';
import { deleteFile, fetchFiles, toggleFavorite } from '../services/api.js';

const FILES_PER_PAGE = 6;

/* ─── Filter Category Definitions ─── */
const CATEGORIES = [
  { key: 'all', label: 'All', icon: FolderOpen },
  { key: 'favorites', label: 'Favorites', icon: Star },
  { key: 'images', label: 'Images', icon: ImageIcon },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'archives', label: 'Archives', icon: Archive },
];

const matchCategory = (file, category) => {
  switch (category) {
    case 'favorites':
      return file.isFavorite === true;
    case 'images':
      return file.fileType?.startsWith('image/');
    case 'documents':
      return (
        file.fileType?.includes('pdf') ||
        file.fileType?.includes('word') ||
        file.fileType?.includes('msword') ||
        file.fileType?.includes('text/') ||
        file.fileType?.includes('json') ||
        file.fileType?.includes('spreadsheet') ||
        file.fileType?.includes('excel') ||
        file.fileType?.includes('csv') ||
        file.fileType?.includes('presentation') ||
        file.fileType?.includes('powerpoint')
      );
    case 'archives':
      return (
        file.fileType?.includes('zip') ||
        file.fileType?.includes('rar')
      );
    default:
      return true;
  }
};

function AllFiles() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const toastTimeoutRef = useRef(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3500);
  };

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchFiles();
      setFiles(data);
    } catch (error) {
      notify(error.response?.data?.message || 'Could not load files.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    return () => window.clearTimeout(toastTimeoutRef.current);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  // Count per category (for badges)
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.key] = files.filter((f) => matchCategory(f, cat.key)).length;
    });
    return counts;
  }, [files]);

  const filteredFiles = useMemo(() => {
    let result = files;

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((f) => matchCategory(f, activeCategory));
    }

    // Search filter
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      result = result.filter((f) => f.originalName.toLowerCase().includes(query));
    }

    return result;
  }, [files, searchTerm, activeCategory]);

  const totalPages = Math.ceil(filteredFiles.length / FILES_PER_PAGE);
  const startIdx = (currentPage - 1) * FILES_PER_PAGE;
  const paginatedFiles = filteredFiles.slice(startIdx, startIdx + FILES_PER_PAGE);

  const handleToggleFavorite = async (id) => {
    try {
      const { data } = await toggleFavorite(id);
      setFiles((curr) =>
        curr.map((f) => (f._id === id ? data.file : f))
      );
    } catch {
      notify('Could not update favorite.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await deleteFile(fileToDelete._id);
      setFiles((curr) => curr.filter((f) => f._id !== fileToDelete._id));
      notify('File deleted successfully.');
    } catch (error) {
      notify(error.response?.data?.message || 'Delete failed. Please try again.', 'error');
    } finally {
      setFileToDelete(null);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <main className="min-h-screen">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-orb" />
        <div className="ambient-orb" />
        <div className="ambient-orb" />
      </div>
      <div className="noise-overlay" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* ─── Back Link ─── */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* ─── Page Header ─── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
              All Files
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
              {searchTerm && ` matching "${searchTerm}"`}
              {activeCategory !== 'all' && ` in ${activeCategory}`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
              size={16}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files…"
              className="
                w-full rounded-xl border border-surface-200 bg-white
                py-2.5 pl-10 pr-4 text-sm text-slate-700
                outline-none transition-all duration-200
                placeholder:text-slate-300
                focus:border-brand-300 focus:ring-2 focus:ring-brand-100
              "
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-300 hover:text-slate-500 hover:bg-surface-100 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ─── Filter Tabs ─── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;
            const count = categoryCounts[key] || 0;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`
                  inline-flex items-center gap-2 rounded-xl px-4 py-2.5
                  text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-200'
                    : 'border border-surface-200 bg-white text-slate-500 hover:bg-surface-50 hover:text-slate-700 hover:border-surface-300 shadow-soft'
                  }
                `}
              >
                <Icon size={15} fill={key === 'favorites' && isActive ? 'currentColor' : 'none'} />
                {label}
                <span className={`
                  rounded-md px-1.5 py-0.5 text-[10px] font-bold
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-100 text-slate-400'
                  }
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── File Grid ─── */}
        {isLoading ? (
          <Loader />
        ) : paginatedFiles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDelete={setFileToDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <div className="mt-10">
                <nav className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-slate-400 hover:bg-surface-50 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 text-sm text-slate-300">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 shadow-soft ${
                          currentPage === page
                            ? 'bg-brand-600 text-white border border-brand-600 shadow-sm shadow-brand-200'
                            : 'border border-surface-200 bg-white text-slate-600 hover:bg-surface-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-slate-400 hover:bg-surface-50 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Showing {startIdx + 1}–{Math.min(startIdx + FILES_PER_PAGE, filteredFiles.length)} of {filteredFiles.length}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-surface-300 bg-white/50 py-20 text-center animate-fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-slate-300">
              {activeCategory === 'favorites' ? <Star size={24} /> : <FolderOpen size={24} />}
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-700">
              {searchTerm
                ? 'No files match your search'
                : activeCategory === 'favorites'
                ? 'No favorites yet'
                : `No ${activeCategory} found`}
            </h3>
            <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">
              {searchTerm
                ? 'Try a different keyword or filter.'
                : activeCategory === 'favorites'
                ? 'Star a file to pin it as a favorite.'
                : 'Try a different category or upload more files.'}
            </p>
            {!searchTerm && activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-brand-700 transition-colors"
              >
                Show All Files
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Toast ─── */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50 flex items-center gap-3
            rounded-xl border px-5 py-3.5 text-sm font-medium
            shadow-elevated backdrop-blur-sm animate-slide-up
            ${toast.type === 'error'
              ? 'border-red-100 bg-white text-red-600'
              : 'border-emerald-100 bg-white text-emerald-600'
            }
          `}
        >
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
            toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
          }`}>
            {toast.type === 'error' ? <X size={12} /> : <Check size={12} />}
          </div>
          {toast.message}
        </div>
      )}

      {/* ─── Delete Modal ─── */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-surface-200 bg-white p-6 shadow-elevated animate-scale-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 mx-auto">
              <Trash2 size={20} />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold text-slate-800">Delete this file?</h3>
            <p className="mt-2 text-center text-sm text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">{fileToDelete.originalName}</span> will be permanently removed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="flex-1 rounded-xl border border-surface-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 active:scale-[0.97] transition-all shadow-sm shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AllFiles;
