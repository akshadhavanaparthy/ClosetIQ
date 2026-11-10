from pydantic import BaseModel, Field
from typing import Optional

class GarmentDetectionRequest(BaseModel):
    imageKey: str = Field(..., description="S3 or Cloudinary storage object key")

class GarmentDetectionResponse(BaseModel):
    category: str
    subCategory: str
    primaryColorHex: str
    primaryColorName: str
    secondaryColorHex: Optional[str] = None
    pattern: str = "Solid"
    formalityLevel: str = "SMART_CASUAL"
    confidence: float = 0.92
