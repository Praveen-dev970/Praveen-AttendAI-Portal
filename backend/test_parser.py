import json

from app.parser.attendance_parser import AttendanceParser

with open(
    "sample_data/attendance_response.json",
    encoding="utf8"
) as f:

    response = json.load(f)

html = response["d"]

attendance = AttendanceParser.parse(html)

print(attendance)