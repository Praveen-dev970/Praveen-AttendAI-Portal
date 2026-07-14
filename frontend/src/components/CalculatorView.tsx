import React, { useState } from 'react';
import { Calculator, HelpCircle, AlertCircle, Sparkles, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react';
// Use AttendanceSubject for subject list
import type { AttendanceSubject } from '../types.js';

interface CalculatorViewProps {
  subjects: AttendanceSubject[];
  subjectWise: any[];
}

export default function CalculatorView({ subjects, subjectWise }: CalculatorViewProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.subject || '');
  const [extraAttending, setExtraAttending] = useState<number>(0);
  const [extraBunking, setExtraBunking] = useState<number>(0);

  const selectedItem = subjectWise.find((item: any) => {
    const sid = item.subject?.subject || item.subject?.course_name || '';
    return sid === selectedSubjectId;
  });

  // Math helper
  const calculateSimulated = () => {
    if (!selectedItem) return { percentage: 100, isSafe: true };
    const present = selectedItem.stats?.attended ?? 0;
    const total = selectedItem.stats?.held ?? 0;
    const late = 0;
    const effectivePresent = present + late; // treat late as present
    
    // Add simulation factor
    const newPresent = effectivePresent + extraAttending;
    const newTotal = total + extraAttending + extraBunking;
    
    if (newTotal === 0) return { percentage: 100, isSafe: true };
    
    const percentage = Math.round((newPresent / newTotal) * 1000) / 10;
    const isSafe = percentage >= 75;
    
    return { percentage, isSafe };
  };

  const simResult = calculateSimulated();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 select-none">
      
      {/* Overview of Subject calculated margins */}
      <div className="xl:col-span-3 space-y-6">
        <div className="bg-white dark:bg-[#0d1527]/50 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Attendance Threshold Report (75% Limit)
          </h3>

          <div className="space-y-3">
            {subjectWise.map((item) => {
              const present = item.stats?.attended ?? 0;
              const total = item.stats?.held ?? 0;
              const late = 0;
              const percentage = item.stats?.percentage ?? 0;
              const bunkable = Math.max(0, Math.floor((present + late) - 0.75 * total));
              const needed = total === 0 || percentage >= 75 ? 0 : Math.ceil((0.75 * total - present) / (1 - 0.75));
              const isSafe = percentage >= 75;

              return (
                <div 
                  key={item.subject?.subject || item.subject?.course_name || ''}
                  onClick={() => setSelectedSubjectId(item.subject?.subject || item.subject?.course_name || '')}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    selectedSubjectId === (item.subject?.subject || item.subject?.course_name || '')
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500/80 dark:border-indigo-500/60 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 max-w-[60%]">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate font-display">
                      {item.subject?.subject || item.subject?.course_name || ''}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                      Current: {present + late}/{total} Lectures
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    {/* Status badge */}
                    <div className="hidden sm:block">
                      {isSafe ? (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 rounded-md font-mono uppercase">
                          Safe ({bunkable} Bunkable)
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 rounded-md font-mono uppercase">
                          Alert ({needed} Needed)
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-right">
                      <p className={`text-sm font-bold ${isSafe ? 'text-indigo-600' : 'text-rose-600'}`}>
                        {percentage}%
                      </p>
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Rate</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Simulation Playground Panel */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#0d1527]/50 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              What-If Playground
            </h3>
            
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50 uppercase font-bold">
              Simulation Live
            </span>
          </div>

          {selectedItem ? (
            <div className="space-y-6">
              {/* Target Course Label */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block">ACTIVE SIMULATING</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px] font-display">
                    {selectedItem.subject?.subject || selectedItem.subject?.course_name || ''}
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                  {selectedItem.subject?.subject || selectedItem.subject?.course_name || ''}
                </span>
              </div>

              {/* Slider / Controls: Attendance */}
              <div className="space-y-4">
                {/* Attending slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400 font-display">Attend next classes:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">+{extraAttending}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={extraAttending}
                    onChange={(e) => {
                      setExtraAttending(Number(e.target.value));
                      if (Number(e.target.value) > 0) setExtraBunking(0); // clear other
                    }}
                    className="w-full accent-indigo-600 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Bunking slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400 font-display">Bunk next classes:</span>
                    <span className="font-mono font-bold text-rose-500">+{extraBunking}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={extraBunking}
                    onChange={(e) => {
                      setExtraBunking(Number(e.target.value));
                      if (Number(e.target.value) > 0) setExtraAttending(0); // clear other
                    }}
                    className="w-full accent-rose-500 h-1 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Projection Result */}
              <div className="p-5 rounded-3xl border bg-slate-50/50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-850/80 flex items-center justify-between shadow-inner">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">PROJECTED ATTENDANCE</span>
                  <p className={`text-3xl font-display font-black leading-none ${simResult.isSafe ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {Number.isFinite(simResult.percentage) ? simResult.percentage : 100}%
                  </p>
                  
                  <div className="pt-2">
                    {simResult.isSafe ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/50 dark:border-emerald-900/50 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold rounded-lg font-mono uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-100/50 dark:border-rose-900/50 text-[10px] text-rose-700 dark:text-rose-400 font-bold rounded-lg font-mono uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        Under 75%
                      </span>
                    )}
                  </div>
                </div>

                {/* SVG Circular Radial Progress */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      className="stroke-slate-150 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    {/* Dynamic Foreground Ring with Glowing Gradients */}
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      className={`transition-all duration-500 ${simResult.isSafe ? 'stroke-indigo-500 dark:stroke-indigo-400' : 'stroke-rose-500 dark:stroke-rose-400'}`}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={201}
                      strokeDashoffset={201 - (Math.min(100, simResult.percentage) / 100) * 201}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Subtle Inner Clock Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {Math.round(simResult.percentage)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic feedback quote */}
              <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/50 flex gap-2.5 items-start rounded-2xl">
                <div className="p-1 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-indigo-900 dark:text-indigo-200 leading-normal font-display">
                  {extraBunking > 0 
                    ? `Bunking ${extraBunking} lectures will decrease attendance by ${Math.round(((selectedItem.stats?.percentage ?? 0) - simResult.percentage)*10)/10}%. ${simResult.isSafe ? 'You are still in the safe zone!' : 'Avoid doing this, as you fall below the required 75% threshold.'}`
                    : extraAttending > 0 
                    ? `Attending ${extraAttending} consecutive classes pulls your average up by +${Math.round((simResult.percentage - (selectedItem.stats?.percentage ?? 0))*10)/10}%. Perfect path to target compliance!`
                    : 'Adjust the sliders above to forecast dynamic schedules.'}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-10">Loading sandbox...</p>
          )}
        </div>
      </div>

    </div>
  );
}
