import { useCallback, useEffect, useMemo, useState } from 'react';

import { api } from '../lib/api';
import type {
  TodayAttendanceResponse,
  YesterdayAttendanceResponse,
} from '../types/attendance';

type WidgetError = { message: string };

export interface AttendanceAnalyticsState {
  today: TodayAttendanceResponse | null;
  yesterday: YesterdayAttendanceResponse | null;
  loading: {
    today: boolean;
    yesterday: boolean;
    all: boolean;
  };
  errors: {
    today: WidgetError | null;
    yesterday: WidgetError | null;
  };
  reload: () => void;
}

function normalizeError(error: unknown): WidgetError {
  return { message: error instanceof Error ? error.message : 'Failed to load attendance' };
}

export function useAttendanceAnalytics(): AttendanceAnalyticsState {
  const [reloadToken, setReloadToken] = useState(0);
  const [today, setToday] = useState<TodayAttendanceResponse | null>(null);
  const [yesterday, setYesterday] = useState<YesterdayAttendanceResponse | null>(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [yesterdayLoading, setYesterdayLoading] = useState(true);
  const [todayError, setTodayError] = useState<WidgetError | null>(null);
  const [yesterdayError, setYesterdayError] = useState<WidgetError | null>(null);

  const reload = useCallback(() => setReloadToken((value) => value + 1), []);
  const loadingAll = useMemo(
    () => todayLoading || yesterdayLoading,
    [todayLoading, yesterdayLoading]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setTodayLoading(true);
      setYesterdayLoading(true);
      setTodayError(null);
      setYesterdayError(null);

      const [todayResult, yesterdayResult] = await Promise.allSettled([
        api.getAttendanceToday(),
        api.getAttendanceYesterday(),
      ]);

      if (cancelled) return;

      if (todayResult.status === 'fulfilled') {
        setToday(todayResult.value);
      } else {
        setToday(null);
        setTodayError(normalizeError(todayResult.reason));
      }

      if (yesterdayResult.status === 'fulfilled') {
        setYesterday(yesterdayResult.value);
      } else {
        setYesterday(null);
        setYesterdayError(normalizeError(yesterdayResult.reason));
      }

      setTodayLoading(false);
      setYesterdayLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return {
    today,
    yesterday,
    loading: { today: todayLoading, yesterday: yesterdayLoading, all: loadingAll },
    errors: { today: todayError, yesterday: yesterdayError },
    reload,
  };
}
