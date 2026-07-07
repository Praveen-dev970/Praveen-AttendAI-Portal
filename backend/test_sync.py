import json

from app.database.database import SessionLocal
from app.parser.attendance_parser import AttendanceParser
from app.services.attendance_service import AttendanceService

# Open sample JSON
with open(
    "sample_data/attendance_response.json",
    encoding="utf-8"
) as f:
    response = json.load(f)

html = response["d"]

attendance = AttendanceParser.parse(html)

student = {
    "roll_number": "23A91A61J4",
    "name": "YEGGADA PRAVEEN",
    "branch": "CSE-AI&ML",
    "semester": "VII"
}

db = SessionLocal()

AttendanceService.save(
    db=db,
    student_data=student,
    attendance_data=attendance
)

db.close()

print("✅ Attendance saved successfully!")