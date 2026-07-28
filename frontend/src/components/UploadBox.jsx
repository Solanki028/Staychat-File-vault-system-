import React, { useRef, useState } from 'react';
import { CloudUpload, FileUp, Tag } from 'lucide-react';
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
const categories = ['General', 'Legal', 'Financial', 'HR', 'Corporate', 'Tax'];

export default function UploadBox({ onUpload, progress, isUploading, onNotify }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');

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

    onUpload(file, selectedCategory);
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
        bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 transition-all duration-300
        ${isDragging
          ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
          : 'border-slate-800 hover:border-slate-700'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => validateAndUpload(event.target.files?.[0])}
      />

      {!isUploading ? (
        <div className="flex flex-col items-center text-center">
          <div className={`
            flex h-14 w-14 items-center justify-center rounded-2xl
            transition-all duration-300
            ${isDragging ? 'bg-indigo-500 text-white scale-110' : 'bg-slate-800 text-slate-400'}
          `}>
            <CloudUpload size={26} />
          </div>

          <h2 className="mt-4 text-base font-bold text-white">
            {isDragging ? 'Release to upload document' : 'Drop document into workspace'}
          </h2>
          <p className="mt-1 text-xs text-slate-400 max-w-md">
            or click below to browse. Supports files up to 25MB.
          </p>

          {/* Category Selector */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-400" /> Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="
              mt-5 inline-flex items-center gap-2 rounded-xl
              bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white
              shadow-lg shadow-indigo-600/25 hover:bg-indigo-500
              active:scale-[0.98] disabled:opacity-50 transition-all
            "
          >
            <FileUp size={15} />
            Browse File
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 text-[10px] font-medium text-slate-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4">
          <CloudUpload size={28} className="text-indigo-400 animate-pulse mb-3" />
          <p className="text-xs font-semibold text-slate-300 mb-3">Uploading document to workspace vault…</p>
          <ProgressBar progress={progress} />
        </div>
      )}
    </section>
  );
}
