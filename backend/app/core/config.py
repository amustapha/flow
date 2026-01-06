from pydantic_settings import BaseSettings


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

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
