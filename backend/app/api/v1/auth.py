from fastapi import APIRouter, HTTPException

from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    StudentResponse
)

from app.services.live_portal_service import LivePortalService

from app.core.security import create_access_token

router = APIRouter()

service = LivePortalService()

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(data: LoginRequest):

    try:

        # Login once and save session
        service.login(
            data.roll_number,
            data.password
        )

        token = create_access_token(
            {
                "sub": data.roll_number
            }
        )

        return LoginResponse(

            access_token=token,

            student=StudentResponse(

                roll_number=data.roll_number,

                cgpa=None

            )

        )

    except Exception as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )