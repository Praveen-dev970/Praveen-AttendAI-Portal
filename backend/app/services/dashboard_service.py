from sqlalchemy.orm import Session

from app.models.student import Student
from app.services.calculator_service import AttendanceCalculator


class DashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        roll_number: str
    ):

        student = (
            db.query(Student)
            .filter(Student.roll_number == roll_number)
            .first()
        )

        if student is None:
            return None

        summary = AttendanceCalculator.calculate_summary(
            student.attendance
        )

        summary["safe_leaves_75"] = AttendanceCalculator.safe_leaves(
            summary["total_held"],
            summary["total_attended"],
            75
        )

        summary["safe_leaves_80"] = AttendanceCalculator.safe_leaves(
            summary["total_held"],
            summary["total_attended"],
            80
        )

        attendance = []

        for row in student.attendance:

            attendance.append({

                "subject": row.subject,

                "held": row.held,

                "attended": row.attended,

                "percentage": row.percentage

            })

        return {

            "student": {

                "roll_number": student.roll_number,

                "name": student.name,

                "branch": student.branch,

                "semester": student.semester

            },

            "summary": summary,

            "attendance": attendance

        }