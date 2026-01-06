"""API v1 router configuration."""

from fastapi import APIRouter
from app.api.v1 import reminders, calls

api_router = APIRouter()
api_router.include_router(reminders.router, prefix="/reminders", tags=["Reminders"])
api_router.include_router(calls.router, prefix="/calls", tags=["Calls"])
