from sqlalchemy.orm import Session

from app.repositories.auth_repository import AuthRepository
from app.security.jwt import create_access_token
from app.security.password import verify_password


class AuthService:

    @staticmethod
    def login(
        db: Session,
        roll_number: str,
        password: str
    ):

        student = AuthRepository.get_student_by_roll_number(
            db,
            roll_number
        )

        if student is None:
            return None

        if student.password_hash is None:
            return None

        if not verify_password(
            password,
            student.password_hash
        ):
            return None

        token = create_access_token(
            {
                "sub": student.roll_number
            }
        )

        AuthRepository.update_last_login(
            db,
            student
        )

        return {
            "access_token": token,
            "roll_number": student.roll_number,
            "name": student.name
        }