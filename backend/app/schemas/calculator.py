from pydantic import BaseModel


class CalculatorRequest(BaseModel):
    held: int
    attended: int
    target: float


class CalculatorResponse(BaseModel):
    current_percentage: float
    target_percentage: float
    need_to_attend: int
    can_miss: int