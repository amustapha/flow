"""Reminder model."""
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from app.models.base import TimestampedBase


class Reminder(TimestampedBase):
    """Reminder model for scheduled voice call reminders."""

    __tablename__ = "reminders"

    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    timezone = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, in_progress, completed, failed, cancelled

    # Relationships
    calls = relationship("Call", back_populates="reminder", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Reminder(id={self.id}, title={self.title}, scheduled_time={self.scheduled_time})>"
