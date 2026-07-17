import React from 'react';
import { APP_CARD } from '../../lib/ui';

export function WidgetShell({
  title,
  subtitle,
  icon,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: unknown;
  children: unknown;
  className?: string;
}) {


  return (
    <section className={`${APP_CARD} p-5 md:p-6 ${className ?? ''}`}>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-slate-800 dark:text-white">
            {icon}
            <span>{title}</span>
          </h3>
          {subtitle ? (
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

