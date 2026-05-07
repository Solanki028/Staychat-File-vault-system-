function ProgressBar({ progress }) {
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500">Uploading</span>
        <span className="text-xs font-bold text-brand-600">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
