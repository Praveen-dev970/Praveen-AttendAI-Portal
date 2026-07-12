from pydantic import BaseModel


class LoginRequest(BaseModel):
    roll_number: str
    password: str


class StudentResponse(BaseModel):
    roll_number: str
    cgpa: float | None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student: StudentResponse