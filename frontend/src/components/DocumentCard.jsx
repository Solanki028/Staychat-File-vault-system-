import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  FileCode, 
  FileSpreadsheet, 
  FileText, 
  Image as ImageIcon, 
  MoreVertical, 
  Star, 
  Trash2, 
  X,
  Tag,
  Clock,
  User
} from 'lucide-react';
import { downloadDocument } from '../api/documentApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getFileMeta = (mimeType, originalName) => {
  const ext = originalName?.split('.').pop()?.toLowerCase() || '';
  if (mimeType?.startsWith('image/')) return { label: 'Image', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: ImageIcon };
  if (mimeType === 'application/pdf') return { label: 'PDF', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: FileText };
  if (['doc', 'docx'].includes(ext)) return { label: 'DOC', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: FileText };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { label: 'XLS', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: FileSpreadsheet };
  return { label: 'FILE', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: FileCode };
};

const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
};

export default function DocumentCard({ doc, onDelete, onToggleFavorite }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const meta = getFileMeta(doc.mimeType || doc.fileType, doc.originalName || doc.title);
  const IconComponent = meta.icon;

  const isImage = (doc.mimeType || doc.fileType)?.startsWith('image/');
  const isPdf = (doc.mimeType || doc.fileType) === 'application/pdf';
  
  const rawPreview = doc.previewUrl || doc.fileUrl || '';
  const previewUrl = rawPreview.startsWith('http') ? rawPreview : `${API_BASE_URL}${rawPreview}`;

  return (
    <>
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 backdrop-blur-xl transition-all flex flex-col justify-between group">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.color}`}>
                {meta.label}
              </span>
              {doc.category && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  {doc.category}
                </span>
              )}
            </div>

            <button
              onClick={() => onToggleFavorite && onToggleFavorite(doc._id)}
              className="text-slate-500 hover:text-amber-400 transition-colors p-1"
            >
              <Star className="w-4 h-4" fill={doc.isFavorite ? '#fbbf24' : 'none'} color={doc.isFavorite ? '#fbbf24' : 'currentColor'} />
            </button>
          </div>

          {/* Icon & Title */}
          <div className="flex items-start gap-3 my-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
              <IconComponent className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors" title={doc.originalName || doc.title}>
                {doc.originalName || doc.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{formatSize(doc.size || doc.fileSize)}</span>
                {doc.version && <span>v{doc.version}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-1">
            {(isImage || isPdf) && (
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => downloadDocument(doc._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete && onDelete(doc)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-semibold text-white truncate">{doc.originalName || doc.title}</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950/50 rounded-xl p-2 min-h-[400px]">
              {isImage ? (
                <img src={previewUrl} alt={doc.originalName} className="max-h-[70vh] object-contain rounded-lg" />
              ) : isPdf ? (
                <iframe src={previewUrl} title={doc.originalName} className="w-full h-[70vh] rounded-lg" />
              ) : (
                <p className="text-xs text-slate-400">Preview not supported for this file format.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
