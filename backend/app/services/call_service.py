"""Service layer for Call business logic."""
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from app.models.call import Call
from app.models.reminder import Reminder
from app.schemas.call import CallCreate, CallUpdate
from app.services.base import BaseService


class CallService(BaseService[Call, CallCreate, CallUpdate]):
    """Service for managing call operations."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        super().__init__(Call, db)

    def create(self, call_data: CallCreate) -> Optional[Call]:
        """Create a new call, verifying reminder exists."""
        # Verify reminder exists
        reminder = (
            self.db.query(Reminder).filter(Reminder.id == call_data.reminder_id).first()
        )
        if not reminder:
            return None

        return super().create(call_data)

    def get(self, call_id: UUID) -> Optional[Call]:
        """Get a call by ID with reminder loaded."""
        return (
            self.db.query(Call)
            .options(joinedload(Call.reminder))
            .filter(Call.id == call_id)
            .first()
        )

    def get_calls(
        self, reminder_id: Optional[UUID] = None, status: Optional[str] = None
    ) -> list[Call]:
        """Get calls with optional filtering."""
        query = self.db.query(Call).options(joinedload(Call.reminder))

        if reminder_id:
            query = query.filter(Call.reminder_id == reminder_id)

        if status:
            query = query.filter(Call.status == status)

        return query.all()

    def get_calls_for_reminder(self, reminder_id: UUID) -> list[Call]:
        """Get all calls for a specific reminder."""
        return (
            self.db.query(Call)
            .filter(Call.reminder_id == reminder_id)
            .order_by(Call.created_at.desc())
            .all()
        )

    def update_call_status(self, call_id: UUID, status: str) -> Optional[Call]:
        """Update only the call status."""
        call = self.get(call_id)
        if not call:
            return None

        call.status = status
        self.db.commit()
        self.db.refresh(call)
        return call
