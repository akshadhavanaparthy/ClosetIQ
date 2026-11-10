import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ClosetIQ Vision & Geometry Service"
    API_V1_STR: str = "/api/v1"
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_API_KEY", "closetiq_internal_ml_key_2026")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8005"))

settings = Settings()
