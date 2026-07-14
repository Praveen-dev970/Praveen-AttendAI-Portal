import React from 'react';
import { APP_CARD } from '../lib/ui.js';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

interface ChartsViewProps {
  subjects: any[];
  marks: any[];
  subjectWise: any[];
  stats: any;
  theme: 'light' | 'dark';
}

export default function ChartsView({ subjects, marks, subjectWise, stats, theme }: ChartsViewProps) {
  const isDark = theme === 'dark';
  
  // Grid and Axis lines colors based on theme state
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor = isDark ? '#475569' : '#94a3b8';
  const tooltipBg = isDark ? '#0b0f19' : '#0f172a';

  // 1. Data mapping for Course Attendance Rate vs Target
  const attendanceData = (subjectWise || []).map((item: any) => ({
    name: item.subject?.subject || '',
    fullName: item.subject?.subject || '',
    attendance: item.stats?.percentage ?? 0,
    target: 75
  }));

  // 2. Data mapping for academic assessment distribution
  const academicData = (subjectWise || []).map((item: any) => {
    const mark = (marks || []).find((m: any) => m?.subjectId === item.subject?.subject);
    return {
      name: item.subject?.subject || '',
      midterm: mark ? mark.midterm : 0,
      internals: mark ? mark.internals : 0,
      endsem: mark ? mark.endsem : 0,
      total: mark ? mark.total : 0
    };
  });

  // 3. Simple simulated historical logs trend over days of the week
  const weekdayTrendData = [
    { day: 'Mon', present: 8, absent: 1, late: 1 },
    { day: 'Tue', present: 9, absent: 0, late: 1 },
    { day: 'Wed', present: 6, absent: 2, late: 2 },
    { day: 'Thu', present: 8, absent: 1, late: 0 },
    { day: 'Fri', present: 10, absent: 0, late: 0 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="p-3 rounded-2xl border text-xs shadow-xl font-display backdrop-blur-md text-white"
          style={{ 
            backgroundColor: `${tooltipBg}e0`, 
            borderColor: isDark ? '#334155' : '#1e293b' 
          }}
        >
          <p className="font-bold text-[10px] uppercase font-mono tracking-wider text-indigo-400">
            {label}
          </p>
          <p className="font-semibold mt-1">
            Rate: <span className="font-mono text-indigo-300">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top statistics banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
          {/* Banner: Overall status info */}
          <div className={`${APP_CARD} flex min-h-[112px] items-center gap-4 p-5`}>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                PRESENCE RATE INDEX
              </span>
              <h4 className="text-lg font-display font-bold text-slate-800 dark:text-white leading-tight">
                {stats?.overallAttendance}% Cumulative
              </h4>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Above safe threshold of 75%
              </span>
            </div>
          </div>

          {/* Dynamic evaluation advice */}
          <div className="lg:col-span-2 flex min-h-[112px] items-center justify-between rounded-3xl border border-slate-200/60 bg-slate-900 p-5 text-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0a0f1d]/50">
            <div className="space-y-1.5 max-w-[75%]">
              <span className="text-[9px] font-mono text-indigo-400 dark:text-indigo-300 uppercase tracking-wider block font-semibold">
                ACADEMIC INTELLIGENCE
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                Dynamic Bunk-Limit Forecasting
              </h4>
              <p className="text-[10px] text-slate-300 dark:text-slate-400 leading-normal font-light">
                We forecast that you have a headroom of <strong>{stats?.bunkableClasses} bunkable sessions</strong> across all active CS courses while preserving target regulations.
              </p>
            </div>
            <div className="p-3 bg-indigo-500/15 rounded-2xl border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse-slow" />
            </div>
          </div>

      </div>

      {/* Main Row Grid of Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
          {/* Chart 1: Course Attendance Rate vs 75% Target */}
          <div className={`${APP_CARD} flex min-h-[336px] flex-col p-5 md:p-6`}>
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Attendance Target Comparison
              </h3>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">MIN REGULATION: 75%</span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={10} fontWeight="bold" />
                  <YAxis stroke={axisColor} fontSize={10} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="attendance" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28} />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '75% Target', position: 'insideTopLeft', fill: '#ef4444', fontSize: 9 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Academic assessment distribution */}
          <div className={`${APP_CARD} flex min-h-[336px] flex-col p-5 md:p-6`}>
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Weightage Assessments Distribution
              </h3>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">TOTAL SCORE (MID + END)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={academicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={isDark ? 0.4 : 0.25}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={10} />
                  <YAxis stroke={axisColor} fontSize={10} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                  <Area type="monotone" dataKey="total" name="Total score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="endsem" name="Endsem marks" stroke="#8b5cf6" fillOpacity={0} strokeWidth={1.5} />
                  <Area type="monotone" dataKey="midterm" name="Midterm marks" stroke="#10b981" fillOpacity={0} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Weekly Presence Activity index */}
          <div className={`${APP_CARD} lg:col-span-2 flex min-h-[336px] flex-col p-5 md:p-6`}>
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Weekly Lecture Activity Trend
              </h3>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">DAILY LECTURES SYNCHRONIZED</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekdayTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="day" stroke={axisColor} fontSize={10} />
                  <YAxis stroke={axisColor} fontSize={10} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                  <Line type="monotone" dataKey="present" name="Present Sessions" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="late" name="Late Sessions" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="absent" name="Absent Sessions" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

      </div>

    </div>
  );
}
