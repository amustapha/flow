"""Pydantic schemas for Reminder model."""

from datetime import datetime, timezone
from typing import Optional
from pydantic import Field, field_validator
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin, ReminderStatus
from app.schemas.validators import (
    validate_e164_phone,
    validate_e164_phone_optional,
    validate_timezone,
    validate_timezone_optional,
)


class ReminderBase(BaseSchema):
    """Base reminder schema with common fields."""

    title: str = Field(..., examples=["Doctor Appointment"])
    message: str = Field(
        ..., examples=["Don't forget your annual checkup with Dr. Smith"]
    )
    phone_number: str = Field(..., examples=["+14155552671"])
    scheduled_time: datetime = Field(..., examples=["2026-01-10T14:30:00Z"])
    timezone: str = Field(..., examples=["America/Los_Angeles"])

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: str) -> str:
        """Validate phone number is in E.164 format."""
        return validate_e164_phone(v)

    @field_validator("timezone")
    @classmethod
    def validate_timezone_field(cls, v: str) -> str:
        """Validate timezone is a valid timezone."""
        return validate_timezone(v)


class ReminderCreate(ReminderBase):
    """Schema for creating a reminder."""

    @field_validator("scheduled_time")
    @classmethod
    def validate_future_time(cls, v: datetime) -> datetime:
        """Ensure scheduled time is in the future."""
        now = datetime.now(timezone.utc)
        # Make v timezone-aware if it's naive (assume UTC)
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        if v <= now:
            raise ValueError("Scheduled time must be in the future")
        return v


class ReminderUpdate(BaseSchema):
    """Schema for updating a reminder (all fields optional)."""

    title: Optional[str] = Field(None, examples=["Doctor Appointment - Rescheduled"])
    message: Optional[str] = Field(
        None, examples=["Your appointment has been moved to next week"]
    )
    phone_number: Optional[str] = Field(None, examples=["+14155552671"])
    scheduled_time: Optional[datetime] = Field(None, examples=["2026-01-17T14:30:00Z"])
    timezone: Optional[str] = Field(None, examples=["America/Los_Angeles"])
    status: Optional[ReminderStatus] = Field(None, examples=["Completed"])

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number if provided."""
        return validate_e164_phone_optional(v)

    @field_validator("timezone")
    @classmethod
    def validate_timezone_field(cls, v: Optional[str]) -> Optional[str]:
        """Validate timezone if provided."""
        return validate_timezone_optional(v)


class ReminderInDB(ReminderBase, IDMixin, TimestampMixin):
    """Schema for reminder as stored in database."""

    status: ReminderStatus


class ReminderResponse(ReminderInDB):
    """Schema for reminder API responses."""

    pass


class ReminderListResponse(BaseSchema):
    """Schema for paginated list of reminders."""

    items: list[ReminderResponse]
    total: int
    page: int
    page_size: int
