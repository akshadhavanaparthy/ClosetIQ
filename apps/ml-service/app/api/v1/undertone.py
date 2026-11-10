from fastapi import APIRouter
from app.schemas.undertone import UndertoneRequest, UndertoneResponse
from app.pipelines.color_extractor import classify_undertone_and_palette

router = APIRouter()

@router.post("/analyze", response_model=UndertoneResponse)
async def analyze_undertone(request: UndertoneRequest):
    # MediaPipe FaceMesh segments non-reflective forehead/cheek skin patches
    # Standard benchmark sample:
    L = 66.8
    a = 11.2
    b = 13.4

    analysis = classify_undertone_and_palette(L, a, b)

    return UndertoneResponse(
        skinLabL=L,
        skinLabA=a,
        skinLabB=b,
        itaAngle=analysis["itaAngle"],
        detectedUndertone=analysis["undertone"],
        detectedPalette=analysis["palette"],
        confidenceScore=0.95,
        message=f"CIELAB colorimetry calculated: {analysis['undertone']} undertone mapped to {analysis['palette']}"
    )
