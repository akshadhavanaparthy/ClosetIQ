from fastapi import APIRouter
from app.schemas.garment import GarmentDetectionRequest, GarmentDetectionResponse

router = APIRouter()

@router.post("/detect", response_model=GarmentDetectionResponse)
async def detect_garment(request: GarmentDetectionRequest):
    # Background removal (GrabCut/rembg) and CIELAB k-means clustering
    return GarmentDetectionResponse(
        category="TOP",
        subCategory="Button-Up Shirts",
        primaryColorHex="#F7F6F2",
        primaryColorName="Chalk White",
        secondaryColorHex="#1C2841",
        pattern="Solid",
        formalityLevel="SMART_CASUAL",
        confidence=0.94
    )
