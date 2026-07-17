import logging
import threading
import uuid
from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.security.jwt import verify_token

from app.services.cache_service import CacheService
from app.services.session_manager import SessionManager
from app.services.sync_service import SyncService

# Note: existing CacheService is dashboard-only in the repo.
# We preserve that cache architecture and only invalidate keys we know.

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()


class SyncJobState:
    def __init__(self, *, roll_number: str, job_id: str):
        self.job_id = job_id
        self.roll_number = roll_number

        self.status: str = "started"  # started | running | completed | failed
        self.progress: int = 0
        self.stage: str = "Sync Started"
        self.message: str = "Sync job created"

        self.started_at: datetime = datetime.utcnow()
        self.finished_at: Optional[datetime] = None

        self._lock = threading.Lock()

    def snapshot(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "job_id": self.job_id,
                "roll_number": self.roll_number,
                "status": self.status,
                "progress": self.progress,
                "stage": self.stage,
                "message": self.message,
                "started_at": self.started_at.isoformat() + "Z",
                "finished_at": self.finished_at.isoformat() + "Z" if self.finished_at else None,
            }

    def set_progress(self, *, progress: int, stage: str, message: Optional[str] = None) -> None:
        with self._lock:
            self.progress = progress
            self.stage = stage
            if message is not None:
                self.message = message

    def set_status(self, status: str) -> None:
        with self._lock:
            self.status = status


# In-memory job registry (lightweight, no Redis)
SYNC_JOBS: dict[str, SyncJobState] = {}


def _advance(job: SyncJobState, *, progress: int, stage: str, message: str) -> None:
    job.set_progress(progress=progress, stage=stage, message=message)
    logger.info("[sync job %s] %s (%d%%)", job.job_id, stage, progress)


def _run_sync(job: SyncJobState) -> None:
    # Run in background thread.
    try:
        job.set_status("running")
        _advance(
            job,
            progress=5,
            stage="Connecting to AEC Portal",
            message="Connecting to the AEC Portal session",
        )

        client = SessionManager.get_session(job.roll_number)
        if client is None:
            # Session expired; match existing behavior.
            raise HTTPException(status_code=401, detail="Session expired. Please login again.")

        _advance(
            job,
            progress=15,
            stage="Authenticating",
            message="Validating the authenticated portal session",
        )

        _advance(
            job,
            progress=30,
            stage="Fetching Attendance",
            message="Fetching attendance from the portal",
        )

        from app.services.attendance_portal_service import AttendancePortalService

        attendance = AttendancePortalService.fetch(client)

        # Ensure student exists in DB
        from app.models.student import Student
        db: Session = next(get_db())  # local session for job
        try:
            # Upsert student minimal fields using cached student in DB.
            student = db.query(Student).filter(Student.roll_number == job.roll_number).first()
            if student is None:
                raise HTTPException(status_code=404, detail="Student not found")

            _advance(
                job,
                progress=50,
                stage="Fetching Marks",
                message="Fetching marks from the portal",
            )

            marks_html = client.get_marks()
            from app.parser.marks_parser import MarksParser

            marks = MarksParser.parse(marks_html)

            _advance(
                job,
                progress=70,
                stage="Updating Database",
                message="Updating attendance and attendance history",
            )
            SyncService.save_attendance(db, student, attendance["overall"])

            _advance(
                job,
                progress=85,
                stage="Refreshing Dashboard",
                message="Refreshing dashboard data",
            )
            # We refresh by simply setting the dashboard cache for this roll.
            # Existing CacheService caches only dashboard.
            from bs4 import BeautifulSoup
            from app.parser.profile_parser import ProfileParser
            student_html = client.get_student_master()
            profile_html = client.get_student_profile(job.roll_number)
            soup = BeautifulSoup(student_html, "lxml")
            name = job.roll_number
            lbl = soup.find(id="lblUser")
            if lbl:
                name = (
                    lbl.get_text(strip=True)
                    .replace("Hi...", "")
                    .replace("Hi", "")
                    .strip()
                )
            profile = ProfileParser.parse(profile_html)
            branch = profile.get("branch", "")
            semester = profile.get("semester", "")
            course = profile.get("course", "")
            semester = semester.replace("Regular(", "").replace(")", "").strip()

            attendance_parsed = attendance
            marks_parsed = marks

            dashboard = {
                "student": {
                    "roll_number": job.roll_number,
                    "name": name,
                    "course": course,
                    "branch": branch,
                    "semester": semester,
                    "cgpa": marks_parsed.get("cgpa"),
                },
                "attendance": attendance_parsed,
                "marks": marks_parsed,
            }

            CacheService.set_dashboard(job.roll_number, dashboard)

            db.close()

        except Exception:
            # Ensure db session close on failure
            try:
                db.close()
            except Exception:
                pass
            raise

        _advance(job, progress=100, stage="Completed", message="Portal sync completed")
        job.set_status("completed")
        job.finished_at = datetime.utcnow()

    except HTTPException as exc:
        job.status = "failed"
        job.finished_at = datetime.utcnow()
        job.set_progress(progress=job.progress, stage=job.stage, message=str(exc.detail))
        logger.exception("Sync job failed %s: %s", job.job_id, exc.detail)
    except Exception as exc:
        job.status = "failed"
        job.finished_at = datetime.utcnow()
        job.set_progress(progress=job.progress, stage=job.stage, message="Sync failed")
        logger.exception("Sync job failed %s: %s", job.job_id, str(exc))


@router.post("/api/v1/sync", status_code=202)
def start_sync(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        roll = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    job_id = str(uuid.uuid4())
    job = SyncJobState(roll_number=roll, job_id=job_id)
    SYNC_JOBS[job_id] = job

    # Start background thread
    t = threading.Thread(target=_run_sync, args=(job,), daemon=True)
    t.start()

    return {"job_id": job_id, "status": "started"}


@router.get("/api/v1/sync/{job_id}")
def get_sync_status(job_id: str):
    job = SYNC_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Sync job not found")
    return job.snapshot()

