"""Base Pydantic schemas and mixins."""

from datetime import datetime
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common configuration."""

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True,
    )


class IDMixin(BaseModel):
    """Mixin for ID field."""

    id: UUID


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""

    created_at: datetime
    updated_at: datetime


class ReminderStatus(str, Enum):
    """Reminder status enum."""

    SCHEDULED = "Scheduled"
    COMPLETED = "Completed"
    FAILED = "Failed"


class CallStatus(str, Enum):
    """Call status enum."""

    CREATED = "created"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
