from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.repositories.student_repository import StudentRepository
from app.services.live_portal_service import LivePortalService
from app.services.sync_service import SyncService


class AuthService:

    @staticmethod
    def login(
        db: Session,
        roll_number: str,
        password: str
    ):

        # The portal is the credential authority.  This call authenticates with
        # AECClient.login(), then retrieves profile, attendance, and marks using
        # the same authenticated portal session.
        portal_data = LivePortalService().get_dashboard(roll_number, password)

        profile = portal_data["student"]
        student = StudentRepository.upsert(
            db=db,
            roll_number=roll_number,
            name=profile["name"],
            branch=profile["branch"],
            semester=profile["semester"],
            cgpa=profile["cgpa"],
        )

        # Keep the existing database-backed attendance endpoints current. Marks
        # are fetched above for the CGPA and live dashboard response, but portal
        # credentials and marks payloads are never persisted on the student.
        SyncService.save_attendance(
            db,
            student,
            portal_data["attendance"]["overall"],
        )

        token = create_access_token(
            {
                "sub": student.roll_number
            }
        )

        return {
            "access_token": token,
            "student": {
                "roll_number": student.roll_number,
                "cgpa": student.cgpa,
            },
            "dashboard": portal_data,
        }
