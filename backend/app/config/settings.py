from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    AEC_BASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings()