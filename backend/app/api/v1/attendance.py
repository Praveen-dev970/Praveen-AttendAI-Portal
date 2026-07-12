from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.student import Student
from app.services.calculator_service import AttendanceCalculator

router = APIRouter()


@router.get("/{roll_number}")
def get_attendance(
    roll_number: str,
    db: Session = Depends(get_db)
):

    student = (
        db.query(Student)
        .filter(Student.roll_number == roll_number)
        .first()
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    attendance = []

    for row in student.attendance:

        attendance.append({

            "subject": row.subject,

            "held": row.held,

            "attended": row.attended,

            "percentage": row.percentage

        })

    return {

        "roll_number": student.roll_number,

        "name": student.name,

        "branch": student.branch,

        "semester": student.semester,

        "attendance": attendance

    }

@router.get("/summary/{roll_number}")
def attendance_summary(
    roll_number: str,
    db: Session = Depends(get_db)
):

    student = (
        db.query(Student)
        .filter(Student.roll_number == roll_number)
        .first()
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    summary = AttendanceCalculator.calculate_summary(
        student.attendance
    )

    summary["safe_leaves_75"] = AttendanceCalculator.safe_leaves(
        summary["total_held"],
        summary["total_attended"],
        75
    )

    summary["safe_leaves_80"] = AttendanceCalculator.safe_leaves(
        summary["total_held"],
        summary["total_attended"],
        80
    )

    return summary

@router.get("/calculate/{roll_number}/{target}")
def calculate_attendance(
    roll_number: str,
    target: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.roll_number == roll_number)
        .first()
    )

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    summary = AttendanceCalculator.calculate_summary(
        student.attendance
    )

    need = AttendanceCalculator.required_classes(
        summary["total_held"],
        summary["total_attended"],
        target
    )

    miss = AttendanceCalculator.safe_leaves(
        summary["total_held"],
        summary["total_attended"],
        target
    )

    return {
        "current_percentage": round(summary["overall_percentage"], 2),
        "target_percentage": target,
        "need_to_attend": need,
        "can_miss": miss
    }