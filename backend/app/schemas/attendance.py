from pydantic import BaseModel


class AttendanceResponse(BaseModel):
    subject: str
    held: int
    attended: int
    percentage: float


class StudentResponse(BaseModel):
    roll_number: str
    name: str
    branch: str
    semester: str
    attendance: list[AttendanceResponse]