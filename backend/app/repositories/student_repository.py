from sqlalchemy.orm import Session

from app.models.student import Student


class StudentRepository:

    @staticmethod
    def get_by_roll_number(
        db: Session,
        roll_number: str
    ):
        return (
            db.query(Student)
            .filter(Student.roll_number == roll_number)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        student_data: dict
    ):

        student = Student(
            roll_number=student_data["roll_number"],
            name=student_data["name"],
            branch=student_data["branch"],
            semester=student_data["semester"]
        )

        db.add(student)
        db.commit()
        db.refresh(student)

        return student

    @staticmethod
    def update(
        db: Session,
        student: Student,
        student_data: dict
    ):

        student.name = student_data["name"]
        student.branch = student_data["branch"]
        student.semester = student_data["semester"]

        db.commit()
        db.refresh(student)

        return student