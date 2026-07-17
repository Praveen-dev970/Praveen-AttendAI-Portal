export type SyncStatus =
  | 'started'
  | 'running'
  | 'completed'
  | 'failed'
  | string;

export type SyncProgressResponse = {
  job_id: string;
  roll_number?: string;
  status: SyncStatus;
  progress: number;
  stage: string;
  message?: string;
  started_at?: string;
  finished_at?: string | null;
};

function getToken(): string {
  return (
    localStorage.getItem('attendai_token') ||
    sessionStorage.getItem('attendai_token') ||
    ''
  );
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export async function triggerSync(): Promise<{ job_id: string; status: string }> {
  const res = await fetch(`${API_BASE}/api/v1/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to start sync');
  }

  return (await res.json()) as { job_id: string; status: string };
}

export async function getSyncStatus(jobId: string): Promise<SyncProgressResponse> {
  const res = await fetch(`${API_BASE}/api/v1/sync/${jobId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch sync status');
  }

  return (await res.json()) as SyncProgressResponse;
}

