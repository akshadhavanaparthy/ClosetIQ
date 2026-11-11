from fastapi import APIRouter, HTTPException
from app.schemas.undertone import UndertoneRequest, UndertoneResponse

router = APIRouter()

@router.post("/analyze", response_model=UndertoneResponse)
async def analyze_undertone(request: UndertoneRequest):
    raise HTTPException(
        status_code=503,
        detail="Undertone analysis is unavailable because no image-analysis model is configured.",
    )
