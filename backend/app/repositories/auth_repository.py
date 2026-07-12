from sqlalchemy.orm import Session

from app.models.student import Student


class AuthRepository:

    @staticmethod
    def get_student_by_roll_number(
        db: Session,
        roll_number: str
    ):
        return (
            db.query(Student)
            .filter(Student.roll_number == roll_number)
            .first()
        )

    @staticmethod
    def update_last_login(
        db: Session,
        student: Student
    ):
        from sqlalchemy.sql import func

        student.last_login = func.now()

        db.commit()

        db.refresh(student)

        return student