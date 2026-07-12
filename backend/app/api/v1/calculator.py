from fastapi import APIRouter

from app.schemas.calculator import (
    CalculatorRequest,
    CalculatorResponse
)

from app.services.calculator_service import AttendanceCalculator

router = APIRouter()


@router.post(
    "/",
    response_model=CalculatorResponse
)
def calculator(data: CalculatorRequest):

    current = 0

    if data.held > 0:
        current = round(
            (data.attended / data.held) * 100,
            2
        )

    need = AttendanceCalculator.classes_needed(
        data.held,
        data.attended,
        data.target
    )

    miss = AttendanceCalculator.safe_leaves(
        data.held,
        data.attended,
        data.target
    )

    return CalculatorResponse(

        current_percentage=current,

        target_percentage=data.target,

        need_to_attend=need,

        can_miss=miss

    )