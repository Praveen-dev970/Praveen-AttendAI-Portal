from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.database.database import Base
from sqlalchemy.orm import relationship


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"))

    subject = Column(String(100))

    held = Column(Integer)

    attended = Column(Integer)

    percentage = Column(Float)

    synced_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    student = relationship("Student", back_populates="attendance")
