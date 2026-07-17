import { useEffect, useMemo, useRef, useState } from 'react';

import { CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { getSyncStatus, type SyncProgressResponse, type SyncStatus } from '../lib/syncApi';

function pctToBarSegments(pct: number) {
  const clamped = Math.max(0, Math.min(100, pct));
  const segments = 24;
  const filled = Math.round((clamped / 100) * segments);
  return { segments, filled, empty: segments - filled };
}

function stageIcon(_stage: string, status: SyncStatus) {
  const s = _stage.toLowerCase();
  if (status === 'failed') return <XCircle className="w-5 h-5 text-rose-500" />;
  if (s.includes('completed'))
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'started' || status === 'running')
    return <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />;
  return <RefreshCw className="w-5 h-5 text-indigo-500" />;
}

export function SyncProgressModal({
  jobId,
  isOpen,
  onClose,
  pollingMs = 500,
  onFinished,
}: {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
  pollingMs?: number;
  onFinished?: (status: 'completed' | 'failed') => void;
}) {
  const [data, setData] = useState<SyncProgressResponse | null | Error>(null);
  const [error, setError] = useState<string | null>(null);
  const terminalStatus = useRef<'completed' | 'failed' | null>(null);

  const canPoll = isOpen && !!jobId;

  useEffect(() => {
    terminalStatus.current = null;
    if (!isOpen) {
      setData(null);
      setError(null);
    }
  }, [isOpen, jobId]);

  useEffect(() => {
    if (!canPoll || !jobId) return;

    let cancelled = false;
    let t: number | undefined;

    const poll = async (): Promise<void> => {
      try {
        setError(null);

        const json = await getSyncStatus(jobId);
        if (cancelled) return;
        setData(json);

        if (json.status === 'completed' || json.status === 'failed') {
          if (terminalStatus.current !== json.status) {
            terminalStatus.current = json.status;
            onFinished?.(json.status);
          }
          return;
        }

        t = window.setTimeout(poll, pollingMs);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || 'Sync failed');
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (t) window.clearTimeout(t);
    };
  }, [canPoll, jobId, pollingMs, onFinished]);

  const pct = data?.progress ?? 0;
  const stage = data?.stage ?? 'Connecting to AEC Portal';
  const status = data?.status ?? 'started';
  const syncInProgress = status === 'started' || status === 'running';

  const bar = useMemo(() => pctToBarSegments(pct), [pct]);

  const stageLines = useMemo(() => {
    const order: { key: string; label: string; at: number }[] = [
      { key: 'connecting', label: 'Connecting to AEC Portal', at: 5 },
      { key: 'authenticating', label: 'Authenticating', at: 15 },
      { key: 'attendance', label: 'Fetching Attendance', at: 30 },
      { key: 'marks', label: 'Fetching Marks', at: 50 },
      { key: 'database', label: 'Updating Database', at: 70 },
      { key: 'dashboard', label: 'Refreshing Dashboard', at: 85 },
      { key: 'completed', label: 'Completed', at: 100 },
    ];

    return order.map((o) => {
      const active = status === 'running' && stage === o.label;
      const done = status === 'completed' || pct > o.at;
      return { ...o, done, active };
    });
  }, [pct, stage, status]);

  const closeIfFinished = () => {
    if (!syncInProgress) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={closeIfFinished}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-800/80 bg-white/90 dark:bg-[#0c1221]/90 shadow-2xl overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {stageIcon(stage, status)}
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  Portal Sync Progress
                </h3>
              </div>
              <p className="mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {stage}
              </p>
            </div>

            <button
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              onClick={closeIfFinished}
              disabled={syncInProgress}
              aria-label="Close"
              title={syncInProgress ? 'Sync running' : 'Close'}
            >
              ✕
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {pct}%
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {status}
              </p>
            </div>

            <div className="mt-2">
              <div className="h-3 rounded-full bg-slate-200/70 dark:bg-slate-800/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  style={{ width: `${pct}%`, transition: 'width 250ms ease' }}
                />
              </div>
              <div className="mt-3">
                <div className="font-mono text-[12px] text-slate-700 dark:text-slate-200">
                  {Array.from({ length: bar.filled }).map((_, i) => (
                    <span key={`f-${i}`}>█</span>
                  ))}
                  {Array.from({ length: bar.empty }).map((_, i) => (
                    <span key={`e-${i}`}>░</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {stageLines.map((line) => (
              <div
                key={line.key}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {line.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : line.active ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 inline-block rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                  )}
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate">
                    {line.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-2xl border border-rose-200/70 bg-rose-50/40 dark:bg-rose-950/20 text-rose-700 dark:text-rose-200 text-[10px]">
              {error}
            </div>
          )}

          <div className="mt-4 text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {data?.finished_at ? `Finished at ${data.finished_at}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

