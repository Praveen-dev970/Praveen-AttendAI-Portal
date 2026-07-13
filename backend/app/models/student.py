from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.database import Base
from sqlalchemy.orm import relationship

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    roll_number = Column(String(20), unique=True, nullable=False)

    name = Column(String(100), nullable=False)

    branch = Column(String(50))

    semester = Column(String(20))

    cgpa = Column(Float)

    last_login = Column(DateTime(timezone=True))

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    attendance = relationship(
    "Attendance",
    back_populates="student",
    cascade="all, delete-orphan"
    )
