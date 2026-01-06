"""Reminder API endpoints."""

from datetime import date
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.api.dependencies import get_reminder_service
from app.services.reminder_service import ReminderService
from app.schemas.base import ReminderStatus
from app.schemas.reminder import (
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse,
    ReminderListResponse,
)

router = APIRouter()


@router.post(
    "/",
    response_model=ReminderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new reminder",
)
def create_reminder(
    reminder_data: ReminderCreate,
    service: ReminderService = Depends(get_reminder_service),
):
    """Create a new reminder with the provided data."""
    reminder = service.create(reminder_data)
    return reminder


@router.get(
    "/",
    response_model=ReminderListResponse,
    summary="List all reminders with optional filtering",
)
def list_reminders(
    status_filter: Optional[ReminderStatus] = Query(None, alias="status"),
    date_filter: Optional[date] = Query(None, alias="date"),
    timezone_filter: Optional[str] = Query(None, alias="timezone"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    service: ReminderService = Depends(get_reminder_service),
):
    """
    Get a list of reminders with optional filtering and pagination.

    Query parameters:
    - status: Filter by reminder status (Scheduled, Completed, Failed)
    - date: Filter by scheduled date (YYYY-MM-DD)
    - timezone: Timezone for date filtering (e.g., "America/Los_Angeles")
    - page: Page number (default: 1)
    - page_size: Number of items per page (default: 50, max: 100)
    """
    skip = (page - 1) * page_size
    reminders, total = service.get_reminders(
        status=status_filter.value if status_filter else None,
        filter_date=date_filter,
        timezone=timezone_filter,
        skip=skip,
        limit=page_size,
    )

    return ReminderListResponse(
        items=reminders, total=total, page=page, page_size=page_size
    )


@router.get(
    "/{reminder_id}",
    response_model=ReminderResponse,
    summary="Get a reminder by ID",
)
def get_reminder(
    reminder_id: UUID, service: ReminderService = Depends(get_reminder_service)
):
    """Get a specific reminder by its ID."""
    reminder = service.get(reminder_id)
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reminder {reminder_id} not found",
        )
    return reminder


@router.patch(
    "/{reminder_id}",
    response_model=ReminderResponse,
    summary="Update a reminder",
)
def update_reminder(
    reminder_id: UUID,
    reminder_data: ReminderUpdate,
    service: ReminderService = Depends(get_reminder_service),
):
    """Update a reminder with partial data."""
    reminder = service.update(reminder_id, reminder_data)
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reminder {reminder_id} not found",
        )
    return reminder


@router.delete(
    "/{reminder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a reminder",
)
def delete_reminder(
    reminder_id: UUID, service: ReminderService = Depends(get_reminder_service)
):
    """Delete a reminder by ID. This will also delete all associated calls."""
    success = service.delete(reminder_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reminder {reminder_id} not found",
        )
    return None
