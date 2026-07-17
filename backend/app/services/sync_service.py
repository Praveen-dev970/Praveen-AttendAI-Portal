from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.student import Student


class SyncService:

    @staticmethod
    def save_attendance(
        db: Session,
        student: Student,
        attendance_data: dict,
    ):

        # Save latest snapshot (existing behaviour)
        db.query(Attendance).filter(
            Attendance.student_id == student.id
        ).delete()

        for row in attendance_data["subjects"]:
            db.add(
                Attendance(
                    student_id=student.id,
                    subject=row["subject"],
                    held=row["held"],
                    attended=row["attended"],
                    percentage=row["percentage"],
                )
            )

        db.commit()


