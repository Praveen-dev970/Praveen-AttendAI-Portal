from sqlalchemy.orm import Session

from app.models.attendance import Attendance


class AttendanceRepository:

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: int
    ):

        return (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student_id
            )
            .all()
        )

    @staticmethod
    def delete_by_student(
        db: Session,
        student_id: int
    ):

        (
            db.query(Attendance)
            .filter(
                Attendance.student_id == student_id
            )
            .delete()
        )

        db.commit()

    @staticmethod
    def save(
        db: Session,
        student_id: int,
        attendance_data: list
    ):

        for item in attendance_data:

            row = Attendance(

                student_id=student_id,

                subject=item["subject"],

                held=item["held"],

                attended=item["attended"],

                percentage=item["percentage"]

            )

            db.add(row)

        db.commit()