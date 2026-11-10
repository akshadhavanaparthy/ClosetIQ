from fastapi import APIRouter
from app.api.v1 import body_shape, undertone, garment

api_router = APIRouter()

api_router.include_router(body_shape.router, prefix="/body", tags=["Body Shape Estimation"])
api_router.include_router(undertone.router, prefix="/undertone", tags=["Undertone & Palette"])
api_router.include_router(garment.router, prefix="/garment", tags=["Garment Detection"])
