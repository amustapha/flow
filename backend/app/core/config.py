from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Flow - Call Me Reminder"
    API_VERSION: str = "0.1.0"
    DATABASE_URL: str = "sqlite:///./flow.db"

    # CORS Configuration
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Vapi Configuration
    VAPI_API_KEY: str = ""
    VAPI_API_URL: str = "https://api.vapi.ai"

    # Twilio Configuration
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # Redis & Celery Configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        env_file_encoding="utf-8",
    )


settings = Settings()
