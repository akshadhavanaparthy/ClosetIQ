from fastapi import APIRouter, HTTPException
from app.schemas.body import BodyAnalysisRequest, BodyAnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=BodyAnalysisResponse)
async def analyze_body(request: BodyAnalysisRequest):
    raise HTTPException(
        status_code=503,
        detail="Body-shape analysis is unavailable because no image-analysis model is configured.",
    )
