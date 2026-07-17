export interface AttendanceSubject {
  subject: string;
  held: number;
  attended: number;
  percentage: number;
}

export interface AttendancePeriodResponse {
  date: string;

  summary: {
    present: number;
    absent: number;
    percentage: number;
  };

  subjects: {
    subject: string;
    status: "present" | "absent";
  }[];
}
export type TodayAttendanceResponse = AttendancePeriodResponse;
export type YesterdayAttendanceResponse = AttendancePeriodResponse;

