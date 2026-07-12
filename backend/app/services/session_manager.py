from app.clients.aec_client import AECClient


class SessionManager:

    _sessions: dict[str, AECClient] = {}

    @classmethod
    def add_session(cls, roll_number: str, client: AECClient):
        cls._sessions[roll_number] = client

    @classmethod
    def get_session(cls, roll_number: str):
        return cls._sessions.get(roll_number)

    @classmethod
    def remove_session(cls, roll_number: str):
        cls._sessions.pop(roll_number, None)

    @classmethod
    def has_session(cls, roll_number: str):
        return roll_number in cls._sessions

    @classmethod
    def total_sessions(cls):
        return len(cls._sessions)