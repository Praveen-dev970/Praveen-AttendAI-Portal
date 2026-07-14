import React from 'react';
import { BadgePercent, GraduationCap, User } from 'lucide-react';
import type { Student } from '../types.js';
import { APP_CARD } from '../lib/ui.js';

interface ProfileViewProps {
  student: Student | any;
  onProfileUpdated: (updatedUser: Student) => void;
  stats: any;
}

export default function ProfileView({ student, stats }: ProfileViewProps) {
  // Badge tier calculation
  const getBadgeTier = () => {
    if (!stats) return { name: 'Bronze Scholar', style: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' };
    const rate = stats.overallAttendance;
    if (rate >= 90) return { name: 'Apex Elite Compliant', style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 animate-pulse-slow' };
    if (rate >= 75) return { name: 'Distinguished Scholar', style: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50' };
    return { name: 'Under Probation Warning', style: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/50' };
  };

  const badge = getBadgeTier();
  const displayName = String(student?.name || 'U');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 select-none">
      
      {/* Profile Overview and Badging Cards */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Main User Card */}
        <div className={`${APP_CARD} p-5 text-center md:p-6`}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white bg-gradient-to-tr from-[#312E81] to-[#4F46E5] text-3xl font-display font-extrabold text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] dark:border-slate-800 dark:from-indigo-600 dark:to-violet-600">
            {displayName.split(' ').map((n: string) => n[0]).join('')}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mt-4 leading-tight">{student?.name || displayName}</h3>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">{student?.branch || ''}</span>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border font-display uppercase tracking-wide bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Roll: {student?.roll_number || ''}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">Branch: {student?.branch || ''}</span>
            <span className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">Semester: {student?.semester || ''}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-5" />

          {/* Achievements badge equivalent */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              ACADEMIC COMPLIANCE STANDING
            </span>
            <div className={`p-3.5 rounded-2xl border font-display font-bold text-xs ${badge.style}`}>
              🎖️ {badge.name}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
              Earn status badges automatically by keeping your presence averages above 75% across the semester.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="xl:col-span-2 space-y-6">
        <div className={`${APP_CARD} p-5 md:p-6`}>
          <h3 className="text-sm font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Student Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">NAME</label>
              <input
                type="text"
                readOnly
                value={student?.name || ''}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">ROLL NUMBER</label>
              <input
                type="text"
                readOnly
                value={student?.roll_number || ''}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">BRANCH</label>
              <input
                type="text"
                readOnly
                value={student?.branch || ''}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">SEMESTER</label>
              <input
                type="text"
                readOnly
                value={student?.semester || ''}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
