from fastapi import FastAPI
from app.database.database import Base, engine
from app.config.settings import settings

# Import models so SQLAlchemy registers them
import app.database.base
from app.api.v1.health import router as health_router
from app.api.v1.attendance import router as attendance_router
from app.api.v1.calculator import router as calculator_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard_live import router as dashboard_router_live
from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from app.core.rate_limit import limiter


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Praveen AttendAI API",
    version="1.0.0"
)

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(SlowAPIMiddleware)

app.include_router(
    health_router,
    prefix="/api/v1/health",
    tags=["Health"]
)

app.include_router(
    attendance_router,
    prefix="/api/v1/attendance",
    tags=["Attendance"]
)

app.include_router(
    calculator_router,
    prefix="/api/v1/calculator",
    tags=["Calculator"]
)

app.include_router(
    dashboard_router,
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


app.include_router(
    dashboard_router_live,
    prefix="/dashboard",
    tags=["Dashboard Live"]
)

origins = [
    "http://localhost:5173",
    #"https://praveen-attendai.vercel.app",
]
if settings.FRONTEND_URL:
    origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Praveen AttendAI 🚀"
    }