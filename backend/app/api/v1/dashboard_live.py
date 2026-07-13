
from fastapi import APIRouter
from fastapi.security import HTTPBearer
router = APIRouter()

security = HTTPBearer()


from fastapi import Depends, HTTPException, Request, Query
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from bs4 import BeautifulSoup

from app.database.database import get_db
from app.models.student import Student
from app.parser.attendance_parser import AttendanceParser
from app.parser.marks_parser import MarksParser
from app.security.jwt import JWT_SECRET, ALGORITHM
from app.config.settings import settings
from app.services.session_manager import SessionManager
from app.services.cache_service import CacheService
from app.core.rate_limit import limiter
from app.security.jwt import verify_token


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
            print(f"[CACHE HIT] {roll}")
            return cached

    print(f"[CACHE MISS] {roll}")

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
    attendance_html = client.get_attendance()
    marks_html = client.get_marks()
    student_html = client.get_student_master()

    attendance = AttendanceParser.parse(attendance_html)
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