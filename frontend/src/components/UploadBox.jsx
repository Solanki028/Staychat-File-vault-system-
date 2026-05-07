import { CloudUpload, FileUp } from 'lucide-react';
import { useRef, useState } from 'react';
import ProgressBar from './ProgressBar.jsx';

const maxFileSize = 25 * 1024 * 1024;
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/json'
];

const supportedFormats = ['Images', 'PDF', 'Docs', 'Excel', 'CSV', 'ZIP', 'JSON'];

function UploadBox({ onUpload, progress, isUploading, onNotify }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndUpload = (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.rar')) {
      onNotify('Unsupported file type. Try images, PDFs, documents, spreadsheets, text, CSV, ZIP, or RAR files.', 'error');
      return;
    }

    if (file.size > maxFileSize) {
      onNotify('File is too large. Maximum size is 25MB.', 'error');
      return;
    }

    onUpload(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndUpload(event.dataTransfer.files?.[0]);
  };

  return (
    <section
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed
        bg-white p-8 sm:p-12 transition-all duration-300
        ${isDragging
          ? 'border-brand-400 bg-brand-50/30 scale-[1.01] shadow-glow'
          : 'border-surface-300 hover:border-brand-300 hover:bg-surface-50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => validateAndUpload(event.target.files?.[0])}
      />

      {/* Upload Content */}
      {!isUploading ? (
        <div className="flex flex-col items-center text-center">
          <div className={`
            flex h-16 w-16 items-center justify-center rounded-2xl
            transition-all duration-300
            ${isDragging
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 scale-110'
              : 'bg-surface-100 text-slate-400 group-hover:bg-brand-50'
            }
          `}>
            <CloudUpload size={28} strokeWidth={1.5} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            {isDragging ? 'Release to upload' : 'Drop your files here'}
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            or click the button below to browse. Supports up to 25MB per file.
          </p>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="
              mt-6 inline-flex items-center gap-2.5 rounded-xl
              bg-brand-600 px-6 py-3 text-sm font-semibold text-white
              shadow-soft hover:bg-brand-700 hover:shadow-card
              active:scale-[0.97] disabled:opacity-50
              transition-all duration-200
            "
          >
            <FileUp size={16} />
            Browse Files
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-surface-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <CloudUpload size={24} className="animate-pulse-slow" />
          </div>
          <p className="mt-4 mb-5 text-sm font-semibold text-slate-600">Uploading your file…</p>
          <ProgressBar progress={progress} />
        </div>
      )}
    </section>
  );
}

export default UploadBox;
