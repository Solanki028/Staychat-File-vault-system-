import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Aurora Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/60">
        {children}
      </div>
    </div>
  );
}
