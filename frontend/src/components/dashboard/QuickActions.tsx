import React from 'react';
import { RefreshCw, Cpu, Flame, Award, Clock, ChevronRight } from 'lucide-react';

interface Props {
  onSyncClick: (service: string) => void;
  syncing: boolean;
  onNavigate: (tab: string) => void;
}

export default function QuickActions({ onSyncClick, syncing, onNavigate }: Props) {
  return (
    <section id="quick-actions" className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-5 backdrop-blur-xl">
      <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">
        QUICK COMMANDS
      </span>

      <div className="space-y-3.5">
        <button
          onClick={() => onSyncClick('Biometric Attendance')}
          disabled={syncing}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-display font-bold p-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-between active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {syncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Cpu className="w-4 h-4 text-white" />
            )}
            <span>{syncing ? 'Scanning swipes...' : 'Sync Attendance'}</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </button>

        <button
          onClick={() => onNavigate('calculator')}
          className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 font-display font-bold p-3 rounded-2xl text-xs transition-all flex items-center justify-between active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2 text-indigo-500">
            <Flame className="w-4 h-4" />
            <span className="text-slate-800 dark:text-slate-200">Attendance Predictor</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>

        <button
          onClick={() => onNavigate('marks')}
          className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 font-display font-bold p-3 rounded-2xl text-xs transition-all flex items-center justify-between active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2 text-amber-500">
            <Award className="w-4 h-4" />
            <span className="text-slate-800 dark:text-slate-200">Academic Marks</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 font-display font-bold p-3 rounded-2xl text-xs transition-all flex items-center justify-between active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-500">
            <Clock className="w-4 h-4" />
            <span className="text-slate-800 dark:text-slate-200">Profile & Target</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </section>
  );
}
