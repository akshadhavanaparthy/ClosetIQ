from pydantic import BaseModel, Field
from typing import Optional

class BodyAnalysisRequest(BaseModel):
    imageKey: str = Field(..., description="S3 or Cloudinary storage object key")

class BodyAnalysisResponse(BaseModel):
    shoulderHipRatio: float
    waistHipRatio: float
    torsoLegRatio: float
    detectedBodyShape: str
    confidenceScore: float
    message: Optional[str] = "Geometric landmark estimation computed successfully"
