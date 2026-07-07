from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class AttendanceHistory(Base):
    __tablename__ = "attendance_history"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"))

    overall_percentage = Column(Float)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )