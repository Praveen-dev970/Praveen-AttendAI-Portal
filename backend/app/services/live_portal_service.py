from app.clients.aec_client import AECClient
from app.parser.attendance_parser import AttendanceParser
from app.parser.marks_parser import MarksParser
from app.parser.profile_parser import ProfileParser
from app.services.session_manager import SessionManager
from bs4 import BeautifulSoup
import re
from app.services.cache_service import CacheService

class LivePortalService:

    def __init__(self):
        self.client = AECClient()

    def login(self, roll_number: str, password: str):

        self.client.login(
            roll_number,
            password
        )

        SessionManager.add_session(
            roll_number,
            self.client
        )

        return True
    
    

    def get_attendance(self, roll_number: str, password: str):

        self.login(roll_number, password)

        attendance_html = self.client.get_attendance()

        attendance = AttendanceParser.parse(attendance_html)

        return attendance

    def get_marks(self, roll_number: str, password: str):

        self.login(roll_number, password)

        marks_html = self.client.get_marks()

        marks = MarksParser.parse(marks_html)

        return marks

    def get_dashboard(self, roll_number: str, password: str,refresh: bool = False,):

        if not refresh:

            cached = CacheService.get_dashboard(roll_number)

            if cached:
                return cached

        self.login(roll_number, password)


        # Fetch portal pages
        student_html = self.client.get_student_master()
        profile_html = self.client.get_student_profile(roll_number)
        attendance_html = self.client.get_attendance()
        marks_html = self.client.get_marks()

        # -----------------------------
        # Parse Student Name
        # -----------------------------
        student_soup = BeautifulSoup(student_html, "lxml")

        name = roll_number

        lbl = student_soup.find(id="lblUser")

        if lbl:
            name = (
                lbl.get_text(strip=True)
                .replace("Hi...", "")
                .replace("Hi", "")
                .strip()
            )

        # -----------------------------
        # Parse Profile
        # -----------------------------
        profile = ProfileParser.parse(profile_html)

        # Prefer profile parser values
        if profile.get("name"):
            name = profile["name"]

        branch = profile.get("branch", "")
        semester = profile.get("semester", "")
        course = profile.get("course", "")

        # Optional: Clean semester text
        semester = (
            semester.replace("Regular(", "")
                    .replace(")", "")
                    .strip()
        )

        # -----------------------------
        # Parse Attendance & Marks
        # -----------------------------
        attendance = AttendanceParser.parse(attendance_html)
        marks = MarksParser.parse(marks_html)


        # -----------------------------
        # Dashboard Response
        # -----------------------------
        dashboard = {
            "student": {
                "roll_number": roll_number,
                "name": name,
                "course": course,
                "branch": branch,
                "semester": semester,
                "cgpa": marks.get("cgpa")
            },
            "attendance": attendance,
            "marks": marks
        }

        CacheService.set_dashboard(
            roll_number,
            dashboard
        )
        return dashboard