"""Call API endpoints."""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.api.dependencies import get_call_service
from app.services.call_service import CallService
from app.schemas.call import (
    CallCreate,
    CallUpdate,
    CallResponse,
    CallWithReminder,
)

router = APIRouter()


@router.post(
    "/",
    response_model=CallResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new call",
)
def create_call(
    call_data: CallCreate,
    service: CallService = Depends(get_call_service),
):
    """Create a new call for a reminder."""
    call = service.create(call_data)
    if not call:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reminder {call_data.reminder_id} not found",
        )
    return call


@router.get(
    "/",
    response_model=list[CallWithReminder],
    summary="List all calls with optional filtering",
)
def list_calls(
    reminder_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    service: CallService = Depends(get_call_service),
):
    """
    Get a list of calls with optional filtering.

    Query parameters:
    - reminder_id: Filter by reminder ID
    - status: Filter by call status (pending, in_progress, completed, failed, cancelled)
    """
    calls = service.get_calls(reminder_id=reminder_id, status=status_filter)
    return calls


@router.get(
    "/{call_id}",
    response_model=CallWithReminder,
    summary="Get a call by ID",
)
def get_call(call_id: UUID, service: CallService = Depends(get_call_service)):
    """Get a specific call by its ID with reminder details."""
    call = service.get(call_id)
    if not call:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Call {call_id} not found",
        )
    return call


@router.patch(
    "/{call_id}",
    response_model=CallResponse,
    summary="Update a call",
)
def update_call(
    call_id: UUID,
    call_data: CallUpdate,
    service: CallService = Depends(get_call_service),
):
    """Update a call with partial data."""
    call = service.update(call_id, call_data)
    if not call:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Call {call_id} not found",
        )
    return call
