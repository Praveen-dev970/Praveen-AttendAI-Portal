from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.attendance import Attendance
from app.repositories.student_repository import StudentRepository
from app.repositories.attendance_repository import AttendanceRepository

class AttendanceService:

    @staticmethod
    def save(
        db: Session,
        student_data: dict,
        attendance_data: list
    ):

        student = StudentRepository.get_by_roll_number(
            db,
            student_data["roll_number"]
            )

        if student is None:

            student = StudentRepository.create(
                db,
                student_data
            )

        else:

            StudentRepository.update(
                db,
                student,
                student_data
            )

        # Remove previous attendance
        AttendanceRepository.delete_by_student(
            db,
            student.id
        )

        AttendanceRepository.save(
            db,
            student.id,
            attendance_data
        )

        db.commit()

        # Insert new attendance
        for item in attendance_data:

            row = Attendance(
                student_id=student.id,
                subject=item["subject"],
                held=item["held"],
                attended=item["attended"],
                percentage=item["percentage"]
            )

            db.add(row)

        db.commit()

        return student