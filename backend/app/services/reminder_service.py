"""Service layer for Reminder business logic."""
from datetime import date
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services.base import BaseService


class ReminderService(BaseService[Reminder, ReminderCreate, ReminderUpdate]):
    """Service for managing reminder operations."""

    def __init__(self, db: Session):
        """Initialize service with database session."""
        super().__init__(Reminder, db)

    def get_reminders(
        self,
        status: Optional[str] = None,
        filter_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[Reminder], int]:
        """Get reminders with optional filtering and pagination."""
        query = self.db.query(Reminder)

        # Apply filters
        if status:
            query = query.filter(Reminder.status == status)

        if filter_date:
            # Filter by date (ignoring time component)
            query = query.filter(
                and_(
                    Reminder.scheduled_time >= filter_date,
                    Reminder.scheduled_time < date(
                        filter_date.year,
                        filter_date.month,
                        filter_date.day + 1 if filter_date.day < 31 else 1,
                    ),
                )
            )

        # Get total count
        total = query.count()

        # Apply pagination
        reminders = query.offset(skip).limit(limit).all()

        return reminders, total
