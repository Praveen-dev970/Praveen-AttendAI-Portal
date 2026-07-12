from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError

JWT_SECRET = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_DAYS = 7


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        days=ACCESS_TOKEN_EXPIRE_DAYS
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    return jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=ALGORITHM
    )


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None