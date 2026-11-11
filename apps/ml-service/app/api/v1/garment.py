from fastapi import APIRouter, HTTPException
from app.schemas.garment import GarmentDetectionRequest, GarmentDetectionResponse

router = APIRouter()

@router.post("/detect", response_model=GarmentDetectionResponse)
async def detect_garment(request: GarmentDetectionRequest):
    raise HTTPException(
        status_code=503,
        detail="Garment analysis is unavailable because no image-analysis model is configured.",
    )
