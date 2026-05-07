import {
  ArrowRight,
  Check,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FileCard from '../components/FileCard.jsx';
import Loader from '../components/Loader.jsx';
import UploadBox from '../components/UploadBox.jsx';
import { deleteFile, fetchFiles, toggleFavorite, uploadFile } from '../services/api.js';

const RECENT_COUNT = 3;

function Home() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

  const pinnedFiles = useMemo(() => files.filter((f) => f.isFavorite), [files]);
  const recentFiles = useMemo(() => files.slice(0, RECENT_COUNT), [files]);

  const imageCount = useMemo(
    () => files.filter((f) => f.fileType?.startsWith('image/')).length,
    [files]
  );

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + (f.fileSize || 0), 0),
    [files]
  );

  const formatTotalSize = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    setProgress(0);
    try {
      const { data } = await uploadFile(file, (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress((prev) => Math.max(prev, percent));
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFiles((curr) => [data.file, ...curr]);
      notify('File uploaded successfully.');
    } catch (error) {
      notify(error.response?.data?.message || 'Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 300);
    }
  };

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

        {/* ─── Header ─── */}
        <header className="mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-2">Secure Storage</p>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                Staychat Vault
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-md">
                Upload, preview and manage your files in one beautiful workspace.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-soft">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                  <FolderOpen size={16} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-none">{files.length}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">Files</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-soft">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-none">{imageCount}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">Images</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-soft">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <HardDrive size={16} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800 leading-none">{formatTotalSize(totalSize)}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">Used</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Upload ─── */}
        <UploadBox
          onUpload={handleUpload}
          progress={progress}
          isUploading={isUploading}
          onNotify={notify}
        />

        {/* ─── Pinned / Favorites Section ─── */}
        {!isLoading && pinnedFiles.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-center gap-2">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <h2 className="text-lg font-bold text-slate-800">Pinned Files</h2>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                {pinnedFiles.length}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pinnedFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDelete={setFileToDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Recent Files ─── */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Uploads</h2>
              <p className="text-sm text-slate-400 mt-0.5">Your latest files.</p>
            </div>

            {files.length > RECENT_COUNT && (
              <Link
                to="/files"
                className="
                  inline-flex items-center gap-1.5 rounded-xl
                  border border-surface-200 bg-white px-4 py-2.5
                  text-sm font-semibold text-brand-600
                  shadow-soft hover:shadow-card hover:border-brand-200
                  transition-all duration-200
                "
              >
                View All ({files.length})
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {isLoading ? (
            <Loader />
          ) : recentFiles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDelete={setFileToDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-surface-300 bg-white/50 py-16 text-center animate-fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-slate-300">
                <FolderOpen size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-700">Your vault is empty</h3>
              <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">
                Upload your first file to get started.
              </p>
            </div>
          )}
        </section>
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

export default Home;
