"""Dependency injection functions for API endpoints."""
from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db


def get_reminder_service(db: Session = Depends(get_db)):
    """Get ReminderService instance with database session."""
    from app.services.reminder_service import ReminderService

    return ReminderService(db)


def get_call_service(db: Session = Depends(get_db)):
    """Get CallService instance with database session."""
    from app.services.call_service import CallService

    return CallService(db)
