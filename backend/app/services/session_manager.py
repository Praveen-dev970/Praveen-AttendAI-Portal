from app.clients.aec_client import AECClient


class SessionManager:

    _sessions: dict[str, AECClient] = {}

    @classmethod
    def add_session(cls, roll_number: str, client: AECClient):
        cls._sessions[roll_number] = client

    @classmethod
    def get_session(cls, roll_number: str):
        return cls._sessions.get(roll_number)
