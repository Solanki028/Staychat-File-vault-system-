import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  FolderOpen, 
  Search, 
  Star, 
  Tag, 
  Trash2, 
  X,
  Plus
} from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import UploadBox from '../components/UploadBox';
import Loader from '../components/Loader';
import { 
  deleteDocumentAsync, 
  fetchDocumentsAsync, 
  toggleFavoriteAsync, 
  uploadDocumentAsync 
} from '../redux/slices/documentSlice';

const CATEGORIES = ['All', 'Favorites', 'Legal', 'Financial', 'HR', 'Corporate', 'Tax', 'General'];

export default function AllFiles({ companyId: propCompanyId }) {
  const { companyId: routeCompanyId } = useParams();
  const companyId = propCompanyId || routeCompanyId;

  const dispatch = useDispatch();
  const { list: documents, loading, pagination } = useSelector((state) => state.documents);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchDocumentsAsync({
          companyId,
          params: {
            category: activeCategory !== 'Favorites' ? activeCategory : undefined,
            isFavorite: activeCategory === 'Favorites' ? true : undefined,
            search: searchTerm
          }
        })
      );
    }
  }, [dispatch, companyId, activeCategory, searchTerm]);

  const handleUpload = async (file, category) => {
    if (!companyId) {
      notify('Please select a company workspace before uploading documents.', 'error');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);
    formData.append('category', category);

    const result = await dispatch(
      uploadDocumentAsync({
        formData,
        onProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      })
    );

    setIsUploading(false);
    setProgress(0);

    if (uploadDocumentAsync.fulfilled.match(result)) {
      notify('Document uploaded to workspace successfully.');
    } else {
      notify(result.payload || 'Failed to upload document.', 'error');
    }
  };

  const handleToggleFavorite = async (documentId) => {
    await dispatch(toggleFavoriteAsync(documentId));
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    const result = await dispatch(deleteDocumentAsync(docToDelete._id));
    if (deleteDocumentAsync.fulfilled.match(result)) {
      notify('Document soft-deleted from workspace.');
    } else {
      notify(result.payload || 'Failed to delete document.', 'error');
    }
    setDocToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Container */}
      <UploadBox
        onUpload={handleUpload}
        progress={progress}
        isUploading={isUploading}
        onNotify={notify}
      />

      {/* Header & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'Favorites' && <Star className="w-3 h-3 inline mr-1 text-amber-400" fill="currentColor" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : documents.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onDelete={setDocToDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Documents Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'No documents match your search criteria.' : 'Upload your first document to this workspace vault.'}
          </p>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-medium backdrop-blur-md shadow-2xl ${
            toast.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Document?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete <span className="text-white font-semibold">{docToDelete.originalName || docToDelete.title}</span>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDocToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
