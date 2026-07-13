from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    StudentResponse
)

from app.clients.aec_client import (
    AECAuthenticationError,
    AECPortalTimeoutError,
    AECPortalUnavailableError,
    AECSessionExpiredError,
)
from app.database.database import get_db
from app.services.auth_service import AuthService

from fastapi import Request

from app.core.rate_limit import limiter

router = APIRouter()

@router.post(
    "/login",
    response_model=LoginResponse
)
@limiter.limit("20/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):

    try:
        result = AuthService.login(
            db=db,
            roll_number=data.roll_number,
            password=data.password,
        )

        return LoginResponse(
            access_token=result["access_token"],
            student=StudentResponse(**result["student"]),
        )

    except AECAuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Roll Number or Password",
        )
    except AECSessionExpiredError:
        raise HTTPException(
            status_code=401,
            detail="Session expired. Please login again.",
        )
    except AECPortalTimeoutError:
        raise HTTPException(
            status_code=504,
            detail="AEC portal timed out. Please try again.",
        )
    except AECPortalUnavailableError:
        raise HTTPException(
            status_code=503,
            detail="AEC portal is currently unavailable. Please try again later.",
        )
