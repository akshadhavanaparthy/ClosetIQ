from pydantic import BaseModel, Field
from typing import Optional

class UndertoneRequest(BaseModel):
    imageKey: str = Field(..., description="S3 or Cloudinary storage object key")

class UndertoneResponse(BaseModel):
    skinLabL: float
    skinLabA: float
    skinLabB: float
    itaAngle: float
    detectedUndertone: str
    detectedPalette: str
    confidenceScore: float
    message: Optional[str] = "Skin colorimetry CIELAB ITA computed successfully"
