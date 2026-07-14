/**
 * Praveen AttendAI
 * Shared Type Definitions
 * Matches FastAPI Backend
 */

/* ===========================
   Authentication
=========================== */

export interface LoginRequest {
  roll_number: string;
  password: string;
}

export interface Student {
  roll_number: string;
  cgpa: number | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  student: Student;
}

/* ===========================
   Attendance
=========================== */

export interface AttendanceSummary {
  held: number;
  attended: number;
  percentage: number;
}

export interface AttendanceSubject {
  subject: string;
  held: number;
  attended: number;
  percentage: number;
}

export interface AttendanceResponse {
  overall: AttendanceSummary;
  subjects: AttendanceSubject[];
}

/* ===========================
   Marks
=========================== */

export interface SemesterSubject {
  course_name: string;
  grade: string;
  credits: number;
}

export interface Semester {
  semester: string;
  sgpa: number;
  subjects: SemesterSubject[];
}

export interface MarksResponse {
  cgpa: number;
  semesters: Semester[];
}

/* ===========================
   Dashboard
=========================== */

export interface DashboardResponse {
  student: Student;
  attendance: AttendanceResponse;
  marks: MarksResponse;
}

/* ===========================
   Attendance Calculator
=========================== */

export interface CalculatorRequest {
  current_percentage: number;
  target_percentage: number;
}

export interface CalculatorResponse {
  current_percentage: number;
  target_percentage: number;
  need_to_attend: number;
  can_miss: number;
}