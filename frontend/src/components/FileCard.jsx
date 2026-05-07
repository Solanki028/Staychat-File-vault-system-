import { Download, Eye, Star, Trash2 } from 'lucide-react';

/* ─── Helpers ─── */
const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const getExtension = (name) => {
  const parts = name?.split('.');
  return parts?.length > 1 ? parts.pop().toUpperCase() : '';
};

const getDocStyle = (fileType) => {
  if (fileType?.includes('pdf')) return { cls: 'file-doc-pdf', label: 'PDF' };
  if (fileType?.includes('word') || fileType?.includes('msword')) return { cls: 'file-doc-doc', label: 'DOC' };
  if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return { cls: 'file-doc-xls', label: 'XLS' };
  if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return { cls: 'file-doc-ppt', label: 'PPT' };
  if (fileType?.includes('zip') || fileType?.includes('rar')) return { cls: 'file-doc-zip', label: 'ZIP' };
  if (fileType?.includes('json')) return { cls: 'file-doc-json', label: 'JSON' };
  if (fileType?.includes('csv')) return { cls: 'file-doc-csv', label: 'CSV' };
  if (fileType?.includes('markdown')) return { cls: 'file-doc-md', label: 'MD' };
  if (fileType?.includes('text/plain')) return { cls: 'file-doc-txt', label: 'TXT' };
  return { cls: 'file-doc-default', label: 'FILE' };
};

/* ─── Realistic Document Icon ─── */
function DocIcon({ fileType, originalName }) {
  const { cls } = getDocStyle(fileType);
  const ext = getExtension(originalName) || 'FILE';

  return (
    <div className={`file-doc-icon ${cls}`}>
      <span>{ext}</span>
    </div>
  );
}

/* ─── FileCard ─── */
function FileCard({ file, onDelete, onToggleFavorite }) {
  const isImage = file.fileType?.startsWith('image/');
  const ext = getExtension(file.originalName);
  const uploadedAt = new Date(file.uploadedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group rounded-2xl border border-surface-200 bg-white shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 overflow-hidden animate-slide-up">
      {/* Preview Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-50">
        {isImage ? (
          <>
            <img
              src={file.fileUrl}
              alt={file.originalName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-white transition-colors"
              >
                <Eye size={12} />
                Preview
              </a>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <DocIcon fileType={file.fileType} originalName={file.originalName} />
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(file._id);
          }}
          className={`
            absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-lg
            transition-all duration-200 z-10
            ${file.isFavorite
              ? 'bg-amber-400 text-white shadow-sm shadow-amber-200'
              : 'bg-white/80 backdrop-blur-sm text-slate-300 opacity-0 group-hover:opacity-100 hover:text-amber-400 hover:bg-white'
            }
          `}
          title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={14} fill={file.isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Extension Badge */}
        {ext && (
          <span className="absolute top-2.5 right-2.5 rounded-md bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 shadow-sm border border-white/50">
            {ext}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="truncate text-sm font-semibold text-slate-800"
          title={file.originalName}
        >
          {file.originalName}
        </h3>

        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
          <span>{formatBytes(file.fileSize)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-200" />
          <span>{uploadedAt}</span>
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex gap-2">
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-surface-200 bg-surface-50 py-2 text-xs font-semibold text-slate-600 hover:bg-surface-100 hover:border-surface-300 transition-all duration-200"
          >
            <Download size={13} />
            Open
          </a>
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/50 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default FileCard;
