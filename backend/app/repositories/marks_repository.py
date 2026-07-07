from sqlalchemy.orm import Session

from app.models.marks import Marks


class MarksRepository:

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: int
    ):

        return (
            db.query(Marks)
            .filter(
                Marks.student_id == student_id
            )
            .all()
        )

    @staticmethod
    def save(
        db: Session,
        student_id: int,
        marks_data: list
    ):

        for item in marks_data:

            row = Marks(

                student_id=student_id,

                subject=item["subject"]

            )

            db.add(row)

        db.commit()