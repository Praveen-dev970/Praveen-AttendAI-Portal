
import logging

from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.clients.aec_client import (
    AECPortalTimeoutError,
    AECPortalUnavailableError,
    AECSessionExpiredError,
)
from app.core.rate_limit import limiter
from app.database.database import get_db
from app.models.student import Student
from app.parser.marks_parser import MarksParser
from app.services.attendance_portal_service import AttendancePortalService
from app.services.cache_service import CacheService
from app.security.jwt import verify_token
from app.services.session_manager import SessionManager

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()


@router.get("/")
@limiter.limit("35/minute")
def get_dashboard(
    request: Request,
    refresh: bool = Query(False),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):

    # -----------------------------
    # Validate JWT
    # -----------------------------
    try:
        payload = verify_token(credentials.credentials)

        if payload is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        roll = payload["sub"]

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    # -----------------------------
    # Return cache if available
    # -----------------------------
    if not refresh:

        cached = CacheService.get_dashboard(roll)
        if cached is not None:
            return cached

    # -----------------------------
    # Get existing session
    # -----------------------------
    client = SessionManager.get_session(roll)

    if client is None:
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please login again."
        )

    # -----------------------------
    # Fetch live data
    # -----------------------------
    try:
        attendance = AttendancePortalService.fetch(client)
        marks_html = client.get_marks()
        student_html = client.get_student_master()
    except AECSessionExpiredError as exc:
        logger.warning("AEC portal session expired while loading dashboard")
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please login again.",
        ) from exc
    except AECPortalTimeoutError as exc:
        logger.warning("AEC portal timed out while loading dashboard")
        raise HTTPException(
            status_code=504,
            detail="AEC portal timed out. Please try again.",
        ) from exc
    except AECPortalUnavailableError as exc:
        logger.error("AEC portal unavailable while loading dashboard")
        raise HTTPException(
            status_code=503,
            detail="AEC portal is currently unavailable. Please try again later.",
        ) from exc

    marks = MarksParser.parse(marks_html)

    # -----------------------------
    # Student information
    # -----------------------------
    student = (
        db.query(Student)
        .filter(Student.roll_number == roll)
        .first()
    )

    soup = BeautifulSoup(student_html, "lxml")

    name = roll

    lbl = soup.find(id="lblUser")

    if lbl:
        name = (
            lbl.get_text(strip=True)
            .replace("Hi...", "")
            .replace("Hi", "")
            .strip()
        )

    # -----------------------------
    # Build response
    # -----------------------------
    dashboard = {
        "student": {
            "roll_number": roll,
            "name": student.name if student else name,
            "course": getattr(student, "course", "") if student else "",
            "branch": student.branch if student else "",
            "semester": student.semester if student else "",
            "cgpa": marks.get("cgpa")
        },
        "attendance": attendance,
        "marks": marks
    }

    # -----------------------------
    # Save cache
    # -----------------------------
    CacheService.set_dashboard(
        roll,
        dashboard
    )

    return dashboard
