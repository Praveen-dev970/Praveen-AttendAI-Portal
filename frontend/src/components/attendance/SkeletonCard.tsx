import React from 'react';
import { APP_CARD } from '../../lib/ui';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <section className={`${APP_CARD} p-5 md:p-6 ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-2/3">
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="mt-2 h-2 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

