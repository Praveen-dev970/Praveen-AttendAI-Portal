from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database.database import Base


class SemesterResult(Base):
    __tablename__ = "semester_results"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"))

    semester = Column(String(20))

    sgpa = Column(Float)

    cgpa = Column(Float)

    credits = Column(Float)