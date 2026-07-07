from fastapi import FastAPI
from app.database.database import Base, engine

# Import models so SQLAlchemy registers them
import app.database.base
from app.api.health import router as health_router
from app.api.attendance import router as attendance_router
from app.api.calculator import router as calculator_router
from app.api.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Praveen AttendAI API",
    version="1.0.0"
)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

app.include_router(
    attendance_router,
    prefix="/attendance",
    tags=["Attendance"]
)

app.include_router(
    calculator_router,
    prefix="/calculator",
    tags=["Calculator"]
)

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Praveen AttendAI 🚀"
    }