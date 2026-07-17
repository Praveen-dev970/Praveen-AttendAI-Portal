import React from 'react';
import { GraduationCap } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Props {
  stats: any;
  currentOverallAttendance: number;
  health: any;
}

export default function HeroCard({ stats, currentOverallAttendance, health }: Props) {
  const overallPresent = stats.classesPresent + stats.classesLate;

  return (
    <section id="hero-attendance" className={`relative overflow-hidden rounded-3xl p-5 md:p-6 bg-gradient-to-br ${health.gradient} border border-slate-200/60 text-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-5 dark:border-slate-800`}>
      <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      <div className="space-y-4 text-center md:text-left w-full md:w-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-100">
          <GraduationCap className="w-3.5 h-3.5" />
          Active Semester {(stats as any)?.semester ?? "VII"}
        </span>

        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-200 font-bold">
            OVERALL SYSTEM COMPLIANCE
          </p>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <h2 className="text-6xl md:text-7xl font-display font-black tracking-tighter leading-none">
              {currentOverallAttendance}%
            </h2>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${health.badgeBg}`}>
              {health.label}
            </span>
          </div>
        </div>

        <div className="text-xs text-indigo-200 font-mono flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
          <span>Last Sync: Today (Live Swipes)</span>
          <span className="hidden md:inline">•</span>
          <span>Verification ID: {stats.rollNumber}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-6 w-full md:w-auto justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="52"
              className="stroke-white/10"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              className="stroke-white transition-all duration-700"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 - (Math.min(100, currentOverallAttendance) / 100) * 326.7}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-display font-black leading-none">{currentOverallAttendance}%</span>
            <span className="text-[8px] font-mono tracking-widest uppercase text-indigo-200 mt-1">RATE</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-6 gap-y-4 bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 shrink-0 w-full sm:w-auto">
          <div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-200 block">HELD</span>
            <p className="text-xl font-display font-bold mt-1 leading-none">{stats.totalClasses}</p>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-200 block">ATTENDED</span>
            <p className="text-xl font-display font-bold mt-1 leading-none text-emerald-300">{overallPresent}</p>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-200 block">MISSED</span>
            <p className="text-xl font-display font-bold mt-1 leading-none text-rose-300">{stats.classesAbsent}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
