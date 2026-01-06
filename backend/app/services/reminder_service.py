"""Service layer for Reminder business logic."""

from datetime import date, datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
import pytz
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
        timezone: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[Reminder], int]:
        """Get reminders with optional filtering and pagination."""
        query = self.db.query(Reminder)

        # Apply filters
        if status:
            query = query.filter(Reminder.status == status)

        if filter_date:
            if timezone:
                # Convert the date to UTC range based on the provided timezone
                tz = pytz.timezone(timezone)

                # Create datetime at start of day in user's timezone
                local_start = tz.localize(datetime.combine(filter_date, datetime.min.time()))

                # Create datetime at end of day in user's timezone
                local_end = tz.localize(datetime.combine(filter_date, datetime.max.time()))

                # Convert to UTC
                utc_start = local_start.astimezone(pytz.UTC)
                utc_end = local_end.astimezone(pytz.UTC)

                query = query.filter(
                    and_(
                        Reminder.scheduled_time >= utc_start,
                        Reminder.scheduled_time <= utc_end,
                    )
                )
            else:
                # Filter by date in UTC (legacy behavior)
                next_day = filter_date + timedelta(days=1)
                query = query.filter(
                    and_(
                        Reminder.scheduled_time >= filter_date,
                        Reminder.scheduled_time < next_day,
                    )
                )

        # Get total count
        total = query.count()

        # Apply sorting and pagination
        reminders = query.order_by(Reminder.scheduled_time).offset(skip).limit(limit).all()

        return reminders, total
