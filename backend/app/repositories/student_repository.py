from sqlalchemy.orm import Session
from sqlalchemy.sql import func

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

    @staticmethod
    def upsert(
        db: Session,
        roll_number: str,
        name: str,
        branch: str,
        semester: str,
        cgpa: float | None = None
    ):
        """
        Insert or update a student in the database.
        Updates last_login and updated_at on both insert and update.
        
        Args:
            db: SQLAlchemy session
            roll_number: Student roll number
            name: Student name
            branch: Student branch
            semester: Student semester
            cgpa: Student CGPA (optional)
        
        Returns:
            Updated or created Student instance
        """
        student = StudentRepository.get_by_roll_number(db, roll_number)

        if student:
            # Update existing student
            student.name = name
            student.branch = branch
            student.semester = semester
            if cgpa is not None:
                student.cgpa = cgpa
            student.last_login = func.now()
            student.updated_at = func.now()
        else:
            # Create new student
            student = Student(
                roll_number=roll_number,
                name=name,
                branch=branch,
                semester=semester,
                cgpa=cgpa,
                last_login=func.now()
            )
            db.add(student)

        db.commit()
        db.refresh(student)

        return student