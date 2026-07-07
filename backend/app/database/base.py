from app.database.database import Base

# Import all models so SQLAlchemy registers them

from app.models.student import Student
from app.models.attendance import Attendance
from app.models.attendance_history import AttendanceHistory
from app.models.marks import Marks
from app.models.semester_result import SemesterResult
from app.models.sync_log import SyncLog