from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/{roll_number}")
def dashboard(
    roll_number: str,
    db: Session = Depends(get_db)
):

    data = DashboardService.get_dashboard(
        db,
        roll_number
    )

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return data