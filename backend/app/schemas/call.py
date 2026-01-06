"""Pydantic schemas for Call model."""

from typing import Optional
from uuid import UUID
from pydantic import Field
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin, CallStatus
from app.schemas.reminder import ReminderResponse


class CallBase(BaseSchema):
    """Base call schema with common fields."""

    reminder_id: UUID = Field(..., examples=["550e8400-e29b-41d4-a716-446655440000"])


class CallCreate(CallBase):
    """Schema for creating a call."""

    pass


class CallUpdate(BaseSchema):
    """Schema for updating a call."""

    vapi_call_id: Optional[str] = Field(None, examples=["vapi_call_456def"])
    status: Optional[CallStatus] = Field(None, examples=["completed"])


class CallResponse(CallBase, IDMixin, TimestampMixin):
    """Schema for call API responses."""

    vapi_call_id: Optional[str] = Field(None, examples=["vapi_call_123abc"])
    status: CallStatus = Field(..., examples=["created"])


class CallWithReminder(CallResponse):
    """Schema for call response with nested reminder."""

    reminder: ReminderResponse
