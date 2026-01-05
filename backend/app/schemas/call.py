"""Pydantic schemas for Call model."""
from typing import Optional
from uuid import UUID
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin, CallStatus
from app.schemas.reminder import ReminderResponse


class CallBase(BaseSchema):
    """Base call schema with common fields."""

    reminder_id: UUID
    vapi_call_id: Optional[str] = None
    status: CallStatus


class CallCreate(BaseSchema):
    """Schema for creating a call."""

    reminder_id: UUID
    vapi_call_id: Optional[str] = None
    status: CallStatus = CallStatus.PENDING


class CallUpdate(BaseSchema):
    """Schema for updating a call (all fields optional)."""

    vapi_call_id: Optional[str] = None
    status: Optional[CallStatus] = None


class CallInDB(CallBase, IDMixin, TimestampMixin):
    """Schema for call as stored in database."""

    pass


class CallResponse(CallInDB):
    """Schema for call API responses."""

    pass


class CallWithReminder(CallResponse):
    """Schema for call response with nested reminder."""

    reminder: ReminderResponse
