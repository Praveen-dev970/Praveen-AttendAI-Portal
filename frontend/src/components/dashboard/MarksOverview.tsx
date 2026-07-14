import React from 'react';
import { ArrowRight, Award, TrendingUp, Zap } from 'lucide-react';
import type { MarksResponse } from '../../types.js';

interface Props {
  marksResponse?: MarksResponse | null;
  subjectWise: any[];
  onNavigate: (tab: string) => void;
}

type CourseRow = {
  course_name: string;
  credits: number;
  semester: string;
  grade: string;
};

const gradeBadgeStyles: Record<string, string> = {
  O: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400',
  S: 'bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/50 text-teal-700 dark:text-teal-400',
  A: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400',
  B: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400',
  C: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50 text-orange-700 dark:text-orange-400',
  D: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400',
  E: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50 text-purple-700 dark:text-purple-400',
  F: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400',
};

const defaultGradeBadgeStyle =
  'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400';

function getPerformanceLabel(cgpa: number) {
  if (cgpa >= 9) return 'Distinguished';
  if (cgpa >= 8) return 'Excellent';
  if (cgpa >= 7) return 'Very Good';
  if (cgpa >= 6) return 'Good Standing';
  return 'Needs Improvement';
}

function TrendChart({ values }: { values: number[] }) {
  const width = 280;
  const height = 72;
  const padding = 8;
  const range = Math.max(...values, 10) - Math.min(...values, 0) || 1;
  const minValue = Math.min(...values, 0);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  if (!values.length) {
    return <div className="h-[72px] rounded-xl bg-slate-50 dark:bg-slate-900/40" />;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[72px] w-full" role="img" aria-label="Semester SGPA trend">
      <defs>
        <linearGradient id="sgpa-trend" x1="0" x2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d={`M ${padding} ${height - padding} H ${width - padding}`} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 4" />
      <polyline points={points.join(' ')} fill="none" stroke="url(#sgpa-trend)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => {
        const [cx, cy] = point.split(',');
        return <circle key={`${point}-${index}`} cx={cx} cy={cy} r="3" fill="currentColor" className="text-violet-500 dark:text-violet-400" />;
      })}
    </svg>
  );
}

export default function MarksOverview({ subjectWise: _subjectWise, onNavigate, marksResponse }: Props) {
  const semesters = marksResponse?.semesters || [];
  const latestSemester = semesters[semesters.length - 1];
  const sgpas = semesters.map(({ sgpa }) => sgpa);
  const currentCGPA = marksResponse?.cgpa ?? 0;
  const latestSGPA = latestSemester?.sgpa ?? 0;
  const highestSGPA = sgpas.length ? Math.max(...sgpas) : 0;
  const lowestSGPA = sgpas.length ? Math.min(...sgpas) : 0;
  const averageSGPA = sgpas.length ? sgpas.reduce((total, sgpa) => total + sgpa, 0) / sgpas.length : 0;
  const performanceLabel = getPerformanceLabel(currentCGPA);
  const latestCourseRows: CourseRow[] = (latestSemester?.subjects || []).map((subject) => ({
    course_name: subject.course_name,
    credits: subject.credits,
    semester: latestSemester.semester,
    grade: subject.grade,
  }));

  const statistics = [
    ['Highest SGPA', highestSGPA.toFixed(2)],
    ['Lowest SGPA', lowestSGPA.toFixed(2)],
    ['Average SGPA', averageSGPA.toFixed(2)],
    ['Total Semesters', String(semesters.length)],
  ];

  return (
    <>
      <section id="cgpa-section" className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          ACADEMIC STANDING & PERFORMANCE INDEX
        </h3>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 bg-slate-50/60 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl"><Zap className="w-5 h-5" /></div>
              <div>
                <span className="text-[8px] font-mono text-slate-400 uppercase block tracking-wider">Current CGPA</span>
                <p className="text-2xl font-display font-black text-slate-800 dark:text-white leading-none mt-1">{currentCGPA.toFixed(2)} / 10</p>
                <span className="text-[9px] text-violet-600 dark:text-violet-400 font-bold block mt-1 uppercase tracking-widest">{performanceLabel}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50/60 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl"><Award className="w-5 h-5" /></div>
              <div>
                <span className="text-[8px] font-mono text-slate-400 uppercase block tracking-wider">Latest SGPA</span>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-wider">{latestSemester?.semester || 'No semester recorded'}</p>
                <p className="text-2xl font-display font-black text-slate-800 dark:text-white leading-none mt-1">{latestSGPA.toFixed(2)} / 10</p>
              </div>
            </div>

            <div className="bg-slate-50/60 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">SGPA Trend</span>
                <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <TrendChart values={sgpas} />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>{semesters[0]?.semester || '--'}</span>
                <span className="text-violet-600 dark:text-violet-400 font-bold">Highest {highestSGPA.toFixed(2)} · {semesters.length} semesters</span>
                <span>{latestSemester?.semester || '--'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {statistics.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 px-4 py-3">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</span>
                <p className="mt-1 text-base font-display font-extrabold text-slate-700 dark:text-slate-200">{value}{label !== 'Total Semesters' && ' / 10'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="marks-overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ACADEMIC MARKS SUMMARY</h3>
            <p className="mt-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">{latestSemester?.semester || 'Latest semester'} subjects</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase text-[9px] font-bold">
                <th className="py-3 px-2">Course</th><th className="py-3 px-2 text-center">Credits</th><th className="py-3 px-2 text-center">Semester</th><th className="py-3 px-2 text-right">Grade</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/40 font-display">
                {latestCourseRows.map((row, index) => {
                  const grade = row.grade || 'N/A';
                  const gradeStyle = gradeBadgeStyles[grade.toUpperCase()] || defaultGradeBadgeStyle;
                  return <tr key={`${row.semester}-${row.course_name}-${index}`} className="hover:bg-slate-50/45 dark:hover:bg-slate-900/30 transition-all duration-300">
                    <td className="py-3.5 px-2"><p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={row.course_name}>{row.course_name}</p></td>
                    <td className="py-3.5 px-2 text-center font-mono font-semibold text-slate-600 dark:text-slate-300">{row.credits}</td>
                    <td className="py-3.5 px-2 text-center font-mono font-semibold text-slate-600 dark:text-slate-300">{row.semester || '—'}</td>
                    <td className="py-3.5 px-2 text-right"><span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${gradeStyle}`}>{grade}</span></td>
                  </tr>;
                })}
                {!latestCourseRows.length && <tr><td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400 font-mono">No marks available for the latest semester.</td></tr>}
              </tbody>
            </table>
          </div>

          <button onClick={() => onNavigate('marks')} className="mt-5 w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 px-4 py-2.5 text-xs font-display font-bold text-indigo-700 dark:text-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            View Complete Academic Record <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
