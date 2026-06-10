import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    MEDIA_BASE_URL: str = os.getenv(
        "SHAKIRA-DEV-MEDIA-URL",
        "https://shakira-dev-media.s3.eu-west-2.amazonaws.com",
    )
    ALLOWED_ORIGINS: list = [
        "https://dev.shakira.dev",
        "https://shakira.dev",
        "http://localhost:3000",
    ]

settings = Settings()