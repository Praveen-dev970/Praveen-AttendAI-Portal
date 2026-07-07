from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health():
    return {
        "status": "healthy",
        "project": "Praveen AttendAI",
        "version": "1.0.0"
    }