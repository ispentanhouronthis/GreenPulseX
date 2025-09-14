"""
API v1 router configuration
"""

from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth,
    users,
    farms,
    devices,
    telemetry,
    predictions,
    notifications,
    admin
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(farms.router, prefix="/farms", tags=["farms"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
api_router.include_router(predictions.router, prefix="/predict", tags=["predictions"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
