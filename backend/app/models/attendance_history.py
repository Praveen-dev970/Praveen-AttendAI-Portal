from sqlalchemy import Column, Date, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database.database import Base


class AttendanceHistory(Base):
    __tablename__ = "attendance_history"

    id = Column(Integer, primary_key=True)

    roll_number = Column(String(20), index=True, nullable=False)

    # Per subject row
    subject = Column(String(100), nullable=False)

    # Logical period value (we derive from sync count for now)
    period = Column(Integer, nullable=False)

    # Sync date
    date = Column(Date, nullable=False)

    # Derived from attended/held
    status = Column(String(30), nullable=False)

    synced_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

