import React, { useEffect, useState } from 'react';
import { BookOpenCheck, CheckCircle2, Minus, Plus, Target } from 'lucide-react';
import { motion } from 'motion/react';
// Using `any` for legacy dashboard stats while migrating to new backend types
import {
  HeroCard,
  SubjectAttendanceGrid,
  AttendanceCharts,
  MarksOverview,
  QuickActions
} from './dashboard';
import type { MarksResponse } from "../types";

interface DashboardViewProps {
  stats: any;
  subjectWise: any[];
  marksResponse?: MarksResponse | null;
  syncing?: boolean;
  onSyncClick?: () => void;
  onNavigate: (tab: string) => void;
}
export default function DashboardView({
  stats,
  subjectWise,
  marksResponse,
  syncing = false,
  onSyncClick = () => undefined,
  onNavigate,
}: DashboardViewProps) {
  const [classesPerDay, setClassesPerDay] = useState(6);

  useEffect(() => {
    const savedClassesPerDay = Number(localStorage.getItem('attendai-classes-per-day'));
    if (Number.isInteger(savedClassesPerDay) && savedClassesPerDay >= 1 && savedClassesPerDay <= 10) {
      setClassesPerDay(savedClassesPerDay);
    }
  }, []);

  const updateClassesPerDay = (adjustment: number) => {
    setClassesPerDay((currentValue) => {
      const nextValue = Math.min(10, Math.max(1, currentValue + adjustment));
      localStorage.setItem('attendai-classes-per-day', String(nextValue));
      return nextValue;
    });
  };

  const currentOverallAttendance = stats.overallAttendance;

  // Determine attendance health status and dynamic styles for the Hero Card
  const getAttendanceHealth = (pct: number) => {
    if (pct >= 85) {
      return {
        label: 'Excellent',
        gradient: 'from-emerald-500 to-teal-600 dark:from-emerald-900/60 dark:to-teal-950/60',
        badgeBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        text: 'text-emerald-600 dark:text-emerald-400',
        ringColor: 'stroke-emerald-500 dark:stroke-emerald-400',
      };
    } else if (pct >= 75) {
      return {
        label: 'Good',
        gradient: 'from-indigo-600 to-violet-700 dark:from-indigo-950/60 dark:to-violet-950/60',
        badgeBg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        ringColor: 'stroke-indigo-500 dark:stroke-indigo-400',
      };
    } else if (pct >= 70) {
      return {
        label: 'Warning',
        gradient: 'from-amber-500 to-orange-600 dark:from-amber-950/60 dark:to-orange-950/60',
        badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        text: 'text-amber-500 dark:text-amber-400',
        ringColor: 'stroke-amber-500 dark:stroke-amber-400',
      };
    } else {
      return {
        label: 'Critical',
        gradient: 'from-rose-600 to-red-700 dark:from-rose-950/60 dark:to-red-950/60',
        badgeBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
        text: 'text-rose-500 dark:text-rose-400',
        ringColor: 'stroke-rose-500 dark:stroke-rose-400',
      };
    }
  };

  const health = getAttendanceHealth(currentOverallAttendance);

  // Dynamic calculation of classes needed for target percentages
  const getNeededClassesForTarget = (present: number, total: number, targetPct: number) => {
    if (total === 0) return 0;
    const currentRate = present / total;
    if (currentRate >= targetPct) return 0;
    return Math.ceil((targetPct * total - present) / (1 - targetPct));
  };

  // Safe to miss classes calculation to maintain 75% or 80%
  const getSafeToMissClasses = (present: number, total: number, targetPct: number) => {
    if (total === 0) return 0;
    const currentRate = present / total;
    if (currentRate < targetPct) return 0;
    return Math.floor((present - targetPct * total) / targetPct);
  };

  // Overall calculations
  const overallPresent = stats.classesPresent + stats.classesLate;
  const overallTotal = stats.totalClasses;
  const attendanceTarget = 75;
  const heldClasses = stats.heldClasses ?? overallTotal ?? 0;
  const attendedClasses = overallPresent ?? 0;
  const isAtTarget = currentOverallAttendance >= attendanceTarget;
  const recommendationClasses = isAtTarget
    ? getSafeToMissClasses(attendedClasses, heldClasses, attendanceTarget / 100)
    : getNeededClassesForTarget(attendedClasses, heldClasses, attendanceTarget / 100);
  const recommendationDays = isAtTarget
    ? Math.floor(recommendationClasses / classesPerDay)
    : Math.ceil(recommendationClasses / classesPerDay);

  // Recharts theme colors setup
  const gridColor = 'rgba(148, 163, 184, 0.1)';
  const axisColor = '#94a3b8';
  const tooltipBg = '#0f172a';

  // Analytics Chart Data Mapping
  const subjectComparisonData = subjectWise.map(item => ({
    name: item.subject?.subject || '',
    fullName: item.subject?.subject || '',
    Attendance: item.stats.percentage,
    Baseline: 75
  }));

  const weeklyActivityData = [
    { week: 'Wk 1', rate: 89 },
    { week: 'Wk 2', rate: 86 },
    { week: 'Wk 3', rate: 84 },
    { week: 'Wk 4', rate: 85 },
    { week: 'Wk 5', rate: 87 },
    { week: 'Wk 6', rate: currentOverallAttendance }
  ];

  const dailySyncLogs = [
    { day: 'Mon', Present: 4, Absent: 1, Late: 0 },
    { day: 'Tue', Present: 5, Absent: 0, Late: 1 },
    { day: 'Wed', Present: 3, Absent: 2, Late: 0 },
    { day: 'Thu', Present: 4, Absent: 0, Late: 1 },
    { day: 'Fri', Present: 5, Absent: 0, Late: 0 }
  ];

  const monthlyTrendData = [
    { month: 'First Mid', rate: 82 },
    { month: 'Second Mid', rate: 85 },
    { month: 'Pre-Endsem', rate: currentOverallAttendance }
  ];

  

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Dynamic Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mt-1">
            Real-time Academic Verification Gateway
          </p>
        </div>
        
        {/* Sync Status Info */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Gateway Stream Online</span>
        </div>
      </div>

      {/* Main Grid: Left side details, Right side widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 columns: Primary Attendance & Stats Modules */}
        <div className="lg:col-span-3 space-y-6">
          <HeroCard stats={stats} currentOverallAttendance={currentOverallAttendance} health={health} />
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            aria-label="Attendance recommendation"
            className="min-h-[80px] rounded-3xl border border-slate-200/60 bg-[#F8FAFC] px-5 py-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-[#0F172A] md:px-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-2.5 text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Attendance Target</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-300">Target: <strong className="font-bold text-slate-900 dark:text-white">{attendanceTarget}%</strong></span>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span>Classes / Day</span>
                      <div className="flex h-9 items-center overflow-hidden rounded-full border border-indigo-200 bg-slate-100/80 font-display dark:border-indigo-900/70 dark:bg-slate-900">
                        <button
                          type="button"
                          aria-label="Decrease classes per day"
                          onClick={() => updateClassesPerDay(-1)}
                          disabled={classesPerDay === 1}
                          className="grid h-full w-9 place-items-center text-indigo-600 transition-all duration-200 hover:bg-indigo-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <motion.span
                          key={classesPerDay}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className="grid w-8 place-items-center text-sm font-black text-slate-900 dark:text-white"
                        >
                          {classesPerDay}
                        </motion.span>
                        <button
                          type="button"
                          aria-label="Increase classes per day"
                          onClick={() => updateClassesPerDay(1)}
                          disabled={classesPerDay === 10}
                          className="grid h-full w-9 place-items-center text-indigo-600 transition-all duration-200 hover:bg-indigo-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-slate-600 dark:text-slate-300">Current: <strong className="font-bold text-slate-900 dark:text-white">{currentOverallAttendance.toFixed(2)}%</strong></span>
                  </div>
                  <p className="mt-1.5 text-[9px] text-slate-400 dark:text-slate-500">Day estimate updates automatically.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:border-slate-200 md:pl-6 dark:md:border-slate-800">
                <div className={`rounded-xl border p-2 ${isAtTarget ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400' : 'border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-400'}`}>
                  {isAtTarget ? <CheckCircle2 className="h-4 w-4" /> : <BookOpenCheck className="h-4 w-4" />}
                </div>
                <div>
                  <p className={`text-[9px] font-mono font-bold uppercase tracking-widest ${isAtTarget ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {isAtTarget ? 'You can skip' : 'Attend next'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-black leading-none text-slate-900 dark:text-white">{recommendationClasses}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Classes</span>
                  </div>
                  <p className="mt-0.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">≈ {recommendationDays} Days</p>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {isAtTarget ? 'You are safely above the required attendance.' : `You must attend the next ${recommendationClasses} classes to reach ${attendanceTarget}%.`}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
          <SubjectAttendanceGrid subjectWise={subjectWise} />
          <MarksOverview marksResponse={marksResponse} subjectWise={subjectWise} onNavigate={onNavigate} />
          <AttendanceCharts
            subjectComparisonData={subjectComparisonData}
            weeklyActivityData={weeklyActivityData}
            dailySyncLogs={dailySyncLogs}
            monthlyTrendData={monthlyTrendData}
            gridColor={gridColor}
            axisColor={axisColor}
          />
        </div>

        {/* Right column: Quick Actions & Schedule Widgets */}
        <div className="space-y-6 lg:sticky lg:top-6 self-start">
          
          <QuickActions onSyncClick={onSyncClick} syncing={syncing} onNavigate={onNavigate} />
        </div>

      </div>

    </div>
  );
}
