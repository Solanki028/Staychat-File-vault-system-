function Loader() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-surface-200 bg-white p-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="aspect-[16/10] rounded-xl bg-surface-100" />
          <div className="mt-4 space-y-3 px-1">
            <div className="h-4 w-3/4 rounded-lg bg-surface-100" />
            <div className="h-3 w-1/2 rounded-lg bg-surface-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-9 flex-1 rounded-xl bg-surface-100" />
              <div className="h-9 flex-1 rounded-xl bg-surface-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loader;
