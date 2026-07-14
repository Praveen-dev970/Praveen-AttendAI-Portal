import React, { useState } from 'react';
import { Settings, ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api.js';
import { APP_BUTTON, APP_CARD } from '../lib/ui.js';

interface SettingsViewProps {
  onSyncTriggered: (log: any) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function SettingsView({ onSyncTriggered }: SettingsViewProps) {
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleTestSync = async (service: 'Attendance portal' | 'University Marks server' | 'Biometric Attendance') => {
    setIsSyncing(service);
    try {
      const log = await api.triggerSync(service);
      onSyncTriggered(log);
      if (log.status === 'success') {
        setFeedback(`Testing Success: Connected securely to ${service} mainframes and loaded metrics.`);
      } else {
        setFeedback(`Testing Interrupted: ${log.message}`);
      }
      setTimeout(() => setFeedback(''), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 select-none">
      
      {/* Settings details column */}
      <div className="xl:col-span-2 space-y-6">
        <div className={`${APP_CARD} p-5 md:p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-display font-bold tracking-wide text-slate-800 dark:text-white">
                <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Portal Settings
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">CONFIGURATION CONTROLS</p>
            </div>
          </div>

          {/* Feedback toasts */}
          {feedback && (
            <div className="mt-4 p-3 bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-800 text-indigo-300 text-xs rounded-2xl flex items-center gap-2 font-display">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <p>{feedback}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-display">Attendance Portal</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-light leading-relaxed">Lectures & class logs</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-display">Marks Server</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-light leading-relaxed">Midterm & internal assessments</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Test Sync panel */}
      <div className="xl:col-span-1 space-y-6">
        <div className={`${APP_CARD} p-5 md:p-6`}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-display font-bold tracking-wide text-slate-800 dark:text-white">
            <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Test Integration APIs
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handleTestSync('Attendance portal')}
              disabled={isSyncing !== null}
              className={`w-full text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500/60 cursor-pointer group ${APP_BUTTON}`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Attendance Portal
                </p>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">Lectures & class logs</span>
              </div>
              <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 ${isSyncing === 'Attendance portal' ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => handleTestSync('University Marks server')}
              disabled={isSyncing !== null}
              className={`w-full text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500/60 cursor-pointer group ${APP_BUTTON}`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Marks Server
                </p>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">Midterm & internal assessments</span>
              </div>
              <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 ${isSyncing === 'University Marks server' ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => handleTestSync('Biometric Attendance')}
              disabled={isSyncing !== null}
              className={`w-full text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500/60 cursor-pointer group ${APP_BUTTON}`}
            >
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Biometric Attendance API
                </p>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">Card swipes & gate entries</span>
              </div>
              <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 ${isSyncing === 'Biometric Attendance' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Security caution info */}
        <div className="space-y-2 rounded-3xl border border-slate-200/60 bg-slate-900 p-5 text-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-[#0a0f1d]/50">
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">SECURITY ENCRYPTION</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-light">
            All API synchronization transactions are secured with standard JWT Bearer encryption tokens. Credential hashes are secured client-side using industry-grade password standards.
          </p>
        </div>
      </div>

    </div>
  );
}
