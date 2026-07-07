from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True)

    roll_number = Column(String(20))

    status = Column(String(30))

    synced_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )