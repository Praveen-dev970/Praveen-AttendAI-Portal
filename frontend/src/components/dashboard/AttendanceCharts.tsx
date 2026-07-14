import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, AreaChart, Area, LineChart, Line, Legend } from 'recharts';

interface Props {
  subjectComparisonData: any[];
  weeklyActivityData: any[];
  dailySyncLogs: any[];
  monthlyTrendData: any[];
  gridColor: string;
  axisColor: string;
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-slate-900/95 dark:bg-[#090e1a]/95 border border-slate-700/50 rounded-2xl text-xs shadow-xl font-display backdrop-blur-md text-white">
        <p className="font-bold text-[10px] uppercase font-mono tracking-widest text-indigo-400">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-semibold mt-1">
            {entry.name}: <span className="font-mono text-indigo-300">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AttendanceCharts({ subjectComparisonData, weeklyActivityData, dailySyncLogs, monthlyTrendData, gridColor, axisColor }: Props) {
  return (
    <section id="attendance-analytics" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          ANALYTICAL ATTENDANCE GRAPHICS
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Historical & Distribution Charts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4">
            <h4 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Subject-wise Comparison
            </h4>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">REGULATION LIMIT: 75%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={10} fontWeight="bold" />
                <YAxis stroke={axisColor} fontSize={10} domain={[0, 100]} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="Attendance" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '75% Threshold', position: 'insideTopLeft', fill: '#ef4444', fontSize: 9 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4">
            <h4 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Attendance Distribution
            </h4>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">WEEKDAYS SWIPE LOG</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySyncLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={10} />
                <YAxis stroke={axisColor} fontSize={10} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Present" stackId="a" fill="#10b981" />
                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Absent" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4">
            <h4 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Attendance Trend (Weekly)
            </h4>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">6-WEEK SWIPE PATH</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gcolor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="week" stroke={axisColor} fontSize={10} />
                <YAxis stroke={axisColor} fontSize={10} domain={[60, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" name="Attendance Rate" stroke="#4f46e5" fillOpacity={1} fill="url(#gcolor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1527]/40 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4">
            <h4 className="text-xs font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Monthly Trend
            </h4>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">ACADEMIC PHASE PROGRESS</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={10} />
                <YAxis stroke={axisColor} fontSize={10} domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" name="Monthly Presence" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
