import React from 'react';
interface Props {
  stats: any;
  overallPresent: number;
}

export default function AttendanceSummary({ stats, overallPresent }: Props) {
  return (
    <section id="attendance-summary" className="space-y-4">
      <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        ATTENDANCE METRIC SUMMARY
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-100 dark:border-slate-850 shadow-md rounded-2xl p-4 hover:border-indigo-500/20 transition-all">
          <span className="text-[8px] font-mono font-bold text-indigo-500 block uppercase tracking-widest">
            Present Classes
          </span>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white mt-1">
            {overallPresent}
          </p>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Includes late presence</span>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-100 dark:border-slate-850 shadow-md rounded-2xl p-4 hover:border-rose-500/20 transition-all">
          <span className="text-[8px] font-mono font-bold text-rose-500 block uppercase tracking-widest">
            Absent Classes
          </span>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white mt-1">
            {stats.classesAbsent}
          </p>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Unexcused absences</span>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-100 dark:border-slate-850 shadow-md rounded-2xl p-4 hover:border-indigo-500/20 transition-all">
          <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase tracking-widest">
            Held Classes
          </span>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white mt-1">
            {stats.totalClasses}
          </p>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Total recorded lectures</span>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-100 dark:border-slate-850 shadow-md rounded-2xl p-4 hover:border-amber-500/20 transition-all">
          <span className="text-[8px] font-mono font-bold text-amber-500 block uppercase tracking-widest">
            Attendance Target
          </span>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white mt-1">75%</p>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Minimum regulation</span>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white dark:bg-[#0d1527]/40 border border-slate-100 dark:border-slate-850 shadow-md rounded-2xl p-4 hover:border-indigo-500/20 transition-all">
          <span className="text-[8px] font-mono font-bold text-violet-500 block uppercase tracking-widest">
            Current Semester 
          </span>
          <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white mt-1">{stats?.semester ?? "VII"}</p>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Computer Science</span>
        </div>
      </div>
    </section>
  );
}
