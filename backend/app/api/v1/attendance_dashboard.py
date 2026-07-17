from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from app.security.jwt import verify_token
from app.core.rate_limit import limiter
from app.services.cache_service import CacheService

router = APIRouter()
security = HTTPBearer()


def _get_cached_attendance(*, roll_number: str, period: str) -> dict:
    dashboard = CacheService.get_dashboard(roll_number)
    if dashboard is None or period not in dashboard.get("attendance", {}):
        raise HTTPException(status_code=404, detail="Attendance data not available")
    return dashboard["attendance"][period]

@router.get("/today")
@limiter.limit("35/minute")
def today(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        roll = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return _get_cached_attendance(roll_number=roll, period="today")


@router.get("/yesterday")
@limiter.limit("35/minute")
def yesterday(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        roll = payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return _get_cached_attendance(roll_number=roll, period="yesterday")


