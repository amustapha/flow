"""Pydantic schemas for Reminder model."""
import re
from datetime import datetime, timezone
from typing import Optional
from pydantic import field_validator
import pytz
from app.schemas.base import BaseSchema, IDMixin, TimestampMixin, ReminderStatus


class ReminderBase(BaseSchema):
    """Base reminder schema with common fields."""

    title: str
    message: str
    phone_number: str
    scheduled_time: datetime
    timezone: str

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: str) -> str:
        """Validate phone number is in E.164 format."""
        pattern = r"^\+[1-9]\d{1,14}$"
        if not re.match(pattern, v):
            raise ValueError(
                "Phone number must be in E.164 format (e.g., +14155552671)"
            )
        return v

    @field_validator("timezone")
    @classmethod
    def validate_timezone(cls, v: str) -> str:
        """Validate timezone is a valid timezone."""
        if v not in pytz.all_timezones:
            raise ValueError(f"Invalid timezone: {v}")
        return v


class ReminderCreate(ReminderBase):
    """Schema for creating a reminder."""

    @field_validator("scheduled_time")
    @classmethod
    def validate_future_time(cls, v: datetime) -> datetime:
        """Ensure scheduled time is in the future."""
        now = datetime.now(timezone.utc)
        if v <= now:
            raise ValueError("Scheduled time must be in the future")
        return v


class ReminderUpdate(BaseSchema):
    """Schema for updating a reminder (all fields optional)."""

    title: Optional[str] = None
    message: Optional[str] = None
    phone_number: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    timezone: Optional[str] = None
    status: Optional[ReminderStatus] = None

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number if provided."""
        if v is None:
            return v
        pattern = r"^\+[1-9]\d{1,14}$"
        if not re.match(pattern, v):
            raise ValueError(
                "Phone number must be in E.164 format (e.g., +14155552671)"
            )
        return v

    @field_validator("timezone")
    @classmethod
    def validate_timezone(cls, v: Optional[str]) -> Optional[str]:
        """Validate timezone if provided."""
        if v is None:
            return v
        if v not in pytz.all_timezones:
            raise ValueError(f"Invalid timezone: {v}")
        return v


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
