from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "project": "Praveen AttendAI",
        "version": "1.1.0"
    }