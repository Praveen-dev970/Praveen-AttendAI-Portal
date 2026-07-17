import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function WidgetEmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50 p-6 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-500">
      <AlertTriangle className="w-9 h-9 mb-2 text-slate-300 dark:text-slate-700" />
      <p className="text-xs font-display font-medium">{title}</p>
      {subtitle ? (
        <p className="text-[10px] font-mono mt-1 text-slate-500 dark:text-slate-400 max-w-[260px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

