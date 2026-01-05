"""Call model."""
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Call(Base):
    """Call model representing voice call attempts for reminders."""

    __tablename__ = "calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    reminder_id = Column(UUID(as_uuid=True), ForeignKey("reminders.id", ondelete="CASCADE"), nullable=False)
    vapi_call_id = Column(String, nullable=True)
    status = Column(String, default="pending", nullable=False)  # pending, in_progress, completed, failed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    reminder = relationship("Reminder", back_populates="calls")

    def __repr__(self):
        return f"<Call(id={self.id}, reminder_id={self.reminder_id}, status={self.status})>"
