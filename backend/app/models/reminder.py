"""Reminder model."""
import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Reminder(Base):
    """Reminder model for scheduled voice call reminders."""

    __tablename__ = "reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    timezone = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, in_progress, completed, failed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    calls = relationship("Call", back_populates="reminder", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Reminder(id={self.id}, title={self.title}, scheduled_time={self.scheduled_time})>"
