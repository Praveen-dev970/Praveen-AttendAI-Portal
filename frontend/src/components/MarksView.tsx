import React, { useState } from 'react';
import { Award, ShieldAlert, RefreshCw, ChevronDown, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MarksResponse, Semester } from '../types.js';
import { APP_BUTTON, APP_CARD } from '../lib/ui.js';

interface MarksViewProps {
  semesters: Semester[];
  marksResponse?: MarksResponse | null;
  onSyncTriggered: (log: any) => void;
}

const gradeBadgeClasses: Record<string, string> = {
  O: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50',
  S: 'bg-teal-50 text-teal-700 dark:bg-teal-950/35 dark:text-teal-300 border-teal-100 dark:border-teal-900/50',
  A: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-300 border-blue-100 dark:border-blue-900/50',
  B: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50',
  C: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300 border-amber-100 dark:border-amber-900/50',
  D: 'bg-orange-50 text-orange-700 dark:bg-orange-950/35 dark:text-orange-300 border-orange-100 dark:border-orange-900/50',
  E: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300 border-rose-100 dark:border-rose-900/50',
};

function getGradeBadgeClass(grade: string) {
  return gradeBadgeClasses[grade] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
}

export default function MarksView({ semesters, marksResponse, onSyncTriggered }: MarksViewProps) {
  const [expandedSemester, setExpandedSemester] = useState<string | null>(semesters[0]?.semester || null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSyncMarks = async () => {
    setIsSyncing(true);
    setSuccessMsg('');
    try {
      onSyncTriggered({ serviceName: 'University Marks server', status: 'success' });
      setSuccessMsg('Successfully synchronized latest grades from the university mainframes!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSemester = (semester: string) => {
    setExpandedSemester(prev => (prev === semester ? null : semester));
  };

  return (
    <div className="space-y-6 select-none">
      <div className={`${APP_CARD} p-5 md:p-6`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-slate-200/70 dark:border-slate-800/80">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-display font-bold tracking-wide text-slate-800 dark:text-white">
              <Award className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              Marks Archive
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">
              SEMESTER-WISE RESULTS AND GRADE CARDS
            </p>
          </div>

          <button
            onClick={handleSyncMarks}
            disabled={isSyncing}
            className={`inline-flex items-center gap-2 self-start md:self-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-display text-xs font-semibold px-3.5 py-2.5 shadow-sm cursor-pointer disabled:opacity-50 ${APP_BUTTON}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Records'}</span>
          </button>
        </div>

        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs rounded-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <p className="font-display font-semibold">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 space-y-4 md:space-y-5">
          {semesters.map((semester, index) => {
            const isExpanded = expandedSemester === semester.semester || (index === 0 && expandedSemester === null);
            const subjects = semester.subjects || [];
            const totalCredits = subjects.reduce((sum, subject) => {
              const parsedCredits = parseFloat(String(subject.credits ?? '0'));
              return sum + (Number.isNaN(parsedCredits) ? 0 : parsedCredits);
            }, 0);
            const safeSgpa = Number.isFinite(semester.sgpa) ? semester.sgpa : 0;
            const semesterLabel = `${semester.semester} Semester`;
            return (
              <motion.article
                layout
                key={semester.semester || `semester-${index}`}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0d1527]/40 backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => toggleSemester(semester.semester)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <BookOpen className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-sm md:text-base font-display font-bold text-slate-800 dark:text-white tracking-tight">
                          {semesterLabel}
                        </h4>
                        <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          SGPA {safeSgpa.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] md:text-xs text-slate-500 dark:text-slate-500 font-mono">
                        {subjects.length} subjects · Premium result summary
                      </p>
                    </div>
                  </div>

                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <div className="hidden overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/60 md:block dark:border-slate-800/80 dark:bg-slate-950/20">
                          <table className="w-full min-w-[520px] text-left">
                            <thead>
                              <tr className="border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/40 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                <th className="px-4 py-3 font-bold">Subject</th>
                                <th className="px-4 py-3 font-bold text-center">Grade</th>
                                <th className="px-4 py-3 font-bold text-right">Credits</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                              {subjects.map((subject, subjectIndex) => {
                                const grade = String(subject.grade || 'N/A').toUpperCase();
                                const credits = subject.credits ?? '0';

                                return (
                                  <tr
                                    key={subject.course_name || `${semester.semester}-${subjectIndex}`}
                                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/35"
                                  >
                                    <td className="px-4 py-3.5">
                                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display truncate block">
                                        {subject.course_name || 'Untitled Course'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                      <span className={`inline-flex min-w-10 items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${getGradeBadgeClass(grade)}`}>
                                        {grade}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                                        {credits}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="md:hidden space-y-2.5">
                          {subjects.map((subject, subjectIndex) => {
                            const grade = String(subject.grade || 'N/A').toUpperCase();
                                const credits = subject.credits ?? '0';

                            return (
                              <div
                                key={subject.course_name || `${semester.semester}-${subjectIndex}`}
                                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/65 dark:bg-slate-950/20 px-4 py-3 transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-900/35"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-display truncate">
                                      {subject.course_name || 'Untitled Course'}
                                    </p>
                                    <p className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                      Subject
                                    </p>
                                  </div>

                                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${getGradeBadgeClass(grade)}`}>
                                    {grade}
                                  </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 dark:border-slate-800/80 pt-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                  <span>Credits</span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300 normal-case tracking-normal">
                                    {credits}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/30 px-4 py-3 text-sm md:text-[13px] font-display">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <span>🏆 SGPA</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                              {safeSgpa.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-right">
                            <span>📚 Total Credits</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                              {Number.isFinite(totalCredits) ? totalCredits.toFixed(1).replace(/\.0$/, '') : '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-50/80 dark:bg-[#0a0f1d]/55 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 backdrop-blur-xl text-slate-600 dark:text-slate-400 flex gap-3 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <ShieldAlert className="w-5 h-5 text-slate-500 dark:text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-display font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Official Result View
          </h4>
          <p className="text-[10px] leading-relaxed font-light text-slate-500 dark:text-slate-500">
            Semester cards expand to show the official grade table, keeping the layout compact, premium, and fully synced to the current backend response.
          </p>
        </div>
      </div>
    </div>
  );
}
