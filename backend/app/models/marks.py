from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database.database import Base


class Marks(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"))

    subject = Column(String(100))

    descriptive_1 = Column(Float)

    assignment_1 = Column(Float)

    objective_1 = Column(Float)

    descriptive_2 = Column(Float)

    assignment_2 = Column(Float)

    objective_2 = Column(Float)

    total = Column(Float)

    grade = Column(String(5))