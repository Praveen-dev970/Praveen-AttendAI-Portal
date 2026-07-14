import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { AttendanceSubject } from '../../types.js';

interface Item {
  subject: AttendanceSubject | { subject: string; code?: string };
  stats: any;
  marks: any | null;
}

interface Props {
  subjectWise: Item[];
}

const getNeededClassesForTarget = (present: number, total: number, targetPct: number) => {
  if (total === 0) return 0;
  const currentRate = present / total;
  if (currentRate >= targetPct) return 0;
  return Math.ceil((targetPct * total - present) / (1 - targetPct));
};

export default function SubjectAttendanceGrid({ subjectWise }: Props) {
  return (
    <section id="subject-attendance" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          SUBJECT-WISE ATTENDANCE RECORDS
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Regulation Barrier: 75%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectWise.map((item) => {
          const percentage = item.stats?.percentage ?? 0;
          const isSafe = percentage >= 75;
          const isWarning = percentage >= 70 && percentage < 75;

          let colorTheme = {
            bg: 'bg-white dark:bg-[#0d1527]/30',
            badge: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400',
            bar: 'bg-emerald-500',
            text: 'text-emerald-600 dark:text-emerald-400'
          };

          if (isWarning) {
            colorTheme = {
              bg: 'bg-white dark:bg-[#0d1527]/30',
              badge: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400',
              bar: 'bg-amber-500',
              text: 'text-amber-600 dark:text-amber-400'
            };
          } else if (percentage < 70) {
            colorTheme = {
              bg: 'bg-white dark:bg-[#0d1527]/30',
              badge: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400',
              bar: 'bg-rose-500',
              text: 'text-rose-600 dark:text-rose-400'
            };
          }

          const presentCount = item.stats?.attended ?? 0;
          const totalCount = item.stats?.held ?? 0;

          const need75 = getNeededClassesForTarget(presentCount, totalCount, 0.75);
          const need80 = getNeededClassesForTarget(presentCount, totalCount, 0.80);
          const need90 = getNeededClassesForTarget(presentCount, totalCount, 0.90);

          return (
            <div 
              key={item.subject?.subject || ''}
              className={`rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 ${colorTheme.bg} shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-800 dark:text-white leading-tight truncate max-w-[130px]" title={item.subject?.subject || ''}>
                      {item.subject?.subject || ''}
                    </h4>
                    <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 block">
                      {item.subject?.subject || ''}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${colorTheme.badge}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <div>
                    <span>CLASSES HELD:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block mt-0.5">{totalCount}</span>
                  </div>
                  <div className="border-l border-slate-100 dark:border-slate-800/80 pl-2">
                    <span>ATTENDED:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block mt-0.5">{presentCount}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorTheme.bar} rounded-full transition-all duration-500`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>0%</span>
                    <span>75% Min</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 space-y-1.5 text-[10px] font-mono">
                <p className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  CONSECUTIVE CLASSES FORECAST
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Need for 75%:</span>
                  {need75 > 0 ? (
                    <span className="text-amber-500 font-bold">{need75} classes</span>
                  ) : (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">Reached <CheckCircle2 className="w-3 h-3" /></span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Need for 80%:</span>
                  {need80 > 0 ? (
                    <span className="text-indigo-500 font-bold">{need80} classes</span>
                  ) : (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">Reached <CheckCircle2 className="w-3 h-3" /></span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Need for 90%:</span>
                  {need90 > 0 ? (
                    <span className="text-violet-500 font-bold">{need90} classes</span>
                  ) : (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">Reached <CheckCircle2 className="w-3 h-3" /></span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
