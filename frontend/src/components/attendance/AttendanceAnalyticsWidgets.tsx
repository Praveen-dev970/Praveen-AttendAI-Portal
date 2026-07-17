import { useAttendanceAnalytics } from '../../hooks/useAttendanceAnalytics';
import type { AttendancePeriodResponse } from '../../types/attendance';
import { SkeletonCard } from './SkeletonCard';
import { WidgetEmptyState } from './WidgetEmptyState';
import { WidgetShell } from './WidgetShell';

function pctForColor(percentage: number) {
  if (percentage >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (percentage >= 75) return 'text-indigo-600 dark:text-indigo-400';
  if (percentage >= 70) return 'text-amber-500 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

export function AttendanceAnalyticsWidgets() {
  const { today, yesterday, loading, errors } = useAttendanceAnalytics();

  return (
    <div className="grid grid-cols-1 gap-6">
      <AttendancePeriodCard
        title="Today's Attendance"
        data={today}
        loading={loading.today}
        error={errors.today}
        accentClass="bg-indigo-500"
      />
      <AttendancePeriodCard
        title="Yesterday's Attendance"
        data={yesterday}
        loading={loading.yesterday}
        error={errors.yesterday}
        accentClass="bg-violet-500"
      />
    </div>
  );
}

function AttendancePeriodCard({
  title,
  data,
  loading,
  error,
  accentClass,
}: {
  title: string;
  data: AttendancePeriodResponse | null;
  loading: boolean;
  error: { message: string } | null;
  accentClass: string;
}) {
  if (loading) return <SkeletonCard />;

  if (error || !data) {
    return (
      <WidgetShell
        title={title}
        subtitle="No data available"
        icon={<span className={`h-2 w-2 rounded-full ${accentClass}`} />}
      >
        <WidgetEmptyState title={`${title} unavailable`} subtitle={error?.message} />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell
      title={title}
      subtitle={`${data.summary.held} Classes • ${data.summary.attended} Present`}    
      
      icon={<span className={`h-2 w-2 rounded-full ${accentClass}`} />}
    >
      <div className="space-y-2">
        {data.subjects.length === 0 ? (
          <WidgetEmptyState title="No attendance records" subtitle="No subjects were returned by the portal." />
        ) : (
          data.subjects.map((subject, index) => (
          <div
            key={`${subject.subject}-${index}`}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/60 px-4 py-3 dark:border-slate-800 dark:bg-[#0d1527]/30"
          >
            <span className="text-sm font-display font-bold text-slate-800 dark:text-white">
              {subject.subject}
            </span>

            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {subject.attended}/{subject.held} • {subject.percentage}%
            </span>
          </div>
        ))
        )}
        <div className="flex items-end justify-between rounded-2xl border border-slate-100 bg-white/60 p-4 dark:border-slate-800 dark:bg-[#0d1527]/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Attendance
          </span>
          <span
            className={`text-3xl font-display font-black ${pctForColor(
              data.summary.percentage
            )}`}
          >
            {data.summary.percentage}%
          </span>
        </div>
      </div>
    </WidgetShell>
  );
}
