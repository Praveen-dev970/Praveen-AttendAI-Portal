from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from bs4 import BeautifulSoup

from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.student import Student

from app.core.security import JWT_SECRET, ALGORITHM
from app.services.session_manager import SessionManager
from app.parser.attendance_parser import AttendanceParser
from app.parser.marks_parser import MarksParser

from fastapi import Query
from app.services.cache_service import CacheService

from fastapi import Request

from app.core.rate_limit import limiter

router = APIRouter()

security = HTTPBearer()


@router.get("/")
@limiter.limit("30/minute")
def get_dashboard(
    request: Request,
    refresh: bool = Query(False),
    credentials=Depends(security),
    db: Session = Depends(get_db)
):

    try:

        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[ALGORITHM]
        )

        roll = payload["sub"]
        student = (
            db.query(Student)
            .filter(Student.roll_number == roll)
            .first()
        )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    client = SessionManager.get_session(roll)

    if client is None:

        raise HTTPException(
            status_code=401,
            detail="Session expired. Please login again."
        )

    attendance_html = client.get_attendance()
    marks_html = client.get_marks()
    student_html = client.get_student_master()

    attendance = AttendanceParser.parse(attendance_html)
    marks = MarksParser.parse(marks_html)



    soup = BeautifulSoup(student_html, "lxml")

    name = roll

    lbl = soup.find(id="lblUser")

    if lbl:
        text = lbl.get_text(strip=True)
        name = text.replace("Hi...", "").replace("Hi", "").strip()

    return {

        "student": {
            "roll_number": roll,
            "name": student.name if student else "",
            "branch": student.branch if student else "",
            "semester": student.semester if student else "",
            "cgpa": marks["cgpa"]
        },

        "attendance": attendance,

        "marks": marks

    }