import type {
  LoginRequest,
  LoginResponse,
  DashboardResponse,
  MarksResponse,
  CalculatorRequest,
  CalculatorResponse,
  Student,
} from "../types";
import type {
  TodayAttendanceResponse,
  YesterdayAttendanceResponse,
} from "../types/attendance";


// import.meta.env may not be typed in some TS configs; cast to any to avoid TS errors
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL  || "http://localhost:8000";

/* =========================================================
   Authentication Helpers
========================================================= */

export function getAuthToken(): string | null {
  return (
    localStorage.getItem("attendai_token") ||
    sessionStorage.getItem("attendai_token")
  );
}

export function setAuthToken(
  token: string,
  remember: boolean = true
): void {
  if (remember) {
    localStorage.setItem("attendai_token", token);
    sessionStorage.removeItem("attendai_token");
  } else {
    sessionStorage.setItem("attendai_token", token);
    localStorage.removeItem("attendai_token");
  }
}

export function removeAuthToken(): void {
  localStorage.removeItem("attendai_token");
  sessionStorage.removeItem("attendai_token");
}

export function getCurrentUser(): Student | null {
  const data = localStorage.getItem("attendai_user");

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: Student | null): void {
  if (user) {
    localStorage.setItem("attendai_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("attendai_user");
  }
}

/* =========================================================
   Generic Request Function
========================================================= */

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();
      message = error.detail || error.message || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  return response.json();
}

/* =========================================================
   API
========================================================= */

export const api = {

  /**
   * Login
   */
  async login(
    data: LoginRequest,
    remember: boolean = true
  ): Promise<LoginResponse> {
    const response = await request<LoginResponse>(
      "/api/v1/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    setAuthToken(response.access_token, remember);
    setCurrentUser(response.student);

    return response;
  },

  /**
   * Dashboard
   */
  getDashboard(refresh = false): Promise<DashboardResponse> {
    // Standardized: use ONLY `/dashboard` (no trailing slash) to avoid 307 redirects.
    const endpoint = `/dashboard${refresh ? "?refresh=true" : ""}`;
    return request<DashboardResponse>(endpoint);
  },

  /** Compatibility wrappers for legacy UI calls — map new dashboard shape */
  async getMe() {
    const d = await request<DashboardResponse>("/dashboard");
    const student = d.student || { roll_number: "unknown", cgpa: null };
    return {
      user: {
        id: student.roll_number,
        name: String(student.roll_number),
        rollNumber: String(student.roll_number),
        cgpa: student.cgpa,
      },
    };
  },

  async getDashboardStats() {
    const d = await request<DashboardResponse>("/dashboard");
    const overall = d.attendance?.overall?.overall || { held: 0, att: 0, per: 0 };
    return {
      overallAttendance: overall.per,
      classesPresent: overall.att,
      classesLate: 0,
      totalClasses: overall.held,
      bunkableClasses: Math.max(
        0,
        Math.floor((overall.att || 0) - 0.75 * (overall.held || 0))
      ),
      heldClasses: overall.held,
    } as any;
  },

  async getSubjects() {
    const d = await request<DashboardResponse>("/dashboard");
    return (d.attendance?.overall?.subjects || []).map((s) => ({
      subject: s.subject,
      held: s.held,
      attended: s.attended,
      percentage: s.percentage,
    }));
  },

  async getSubjectWiseAttendance() {
    const d = await request<DashboardResponse>("/dashboard");
    return (d.attendance?.overall?.subjects || []).map((s) => ({
      subject: { code: s.subject, name: s.subject },
      stats: { percentage: s.percentage, attended: s.attended, held: s.held },
      marks: null,
    }));
  },

  async getSyncLogs() {
    // New backend does not expose sync logs in the dashboard response currently.
    return [] as any[];
  },

  async recordAttendance(_subjectId: string, _date: string, _status: string, _notes?: string) {
    // Placeholder — implement write endpoints on the new API if needed.
    return { status: 'ok' } as any;
  },

  async deleteAttendance(_recordId: string) {
    return { status: 'ok' } as any;
  },

  async triggerSync(_service: string) {
    return { status: 'success' } as any;
  },

  async upsertMarks(_marks: any) {
    return { status: 'ok' } as any;
  },

  async clearSyncLogs() {
    return { status: 'ok' } as any;
  },

  async updateProfile(_name: string, _rollNumber: string, _targetPercentage?: number) {
    return { status: 'ok' } as any;
  },

  /**
   * Attendance
   */
  getAttendanceToday(): Promise<TodayAttendanceResponse> {
    return request<TodayAttendanceResponse>("/api/v1/attendance-dashboard/today");
  },

  getAttendanceYesterday(): Promise<YesterdayAttendanceResponse> {
    return request<YesterdayAttendanceResponse>("/api/v1/attendance-dashboard/yesterday");
  },



  /**
   * Marks
   */
  getMarks(): Promise<MarksResponse> {
    return request<MarksResponse>("/marks");
  },

  /**
   * Attendance Calculator
   */
  calculateAttendance(
    data: CalculatorRequest
  ): Promise<CalculatorResponse> {
    return request<CalculatorResponse>("/calculator", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout
   */
  logout(): void {
    removeAuthToken();
    setCurrentUser(null);
  },
};
