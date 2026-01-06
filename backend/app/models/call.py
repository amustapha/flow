"""Call model."""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import TimestampedBase


class Call(TimestampedBase):
    """Call model representing voice call attempts for reminders."""

    __tablename__ = "calls"

    reminder_id = Column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"), nullable=False)
    vapi_call_id = Column(String, nullable=True)
    status = Column(String, default="pending", nullable=False)  # pending, in_progress, completed, failed, cancelled

    # Relationships
    reminder = relationship("Reminder", back_populates="calls")

    def __repr__(self):
        return f"<Call(id={self.id}, reminder_id={self.reminder_id}, status={self.status})>"
