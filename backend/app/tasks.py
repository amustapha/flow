"""Celery tasks for background processing."""

import logging
from uuid import UUID
from typing import Optional
from datetime import datetime, timezone
import asyncio

from celery import Task
from sqlalchemy.orm import Session

from app.celery_app import celery_app
from app.clients import VapiClient
from app.core.database import SessionLocal
from app.services import CallService, ReminderService
from app.models.reminder import Reminder
from app.schemas.call import CallCreate
from app.core.exceptions import NotFoundError, ValidationError

logger = logging.getLogger(__name__)


class DatabaseTask(Task):
    """Base task with database session management."""

    _db: Optional[Session] = None

    def get_db(self) -> Session:
        if self._db is None:
            self._db = SessionLocal()
        return self._db

    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None


@celery_app.task(
    base=DatabaseTask,
    bind=True,
    name="app.tasks.initiate_vapi_call",
    max_retries=3,
    default_retry_delay=60,
)
def initiate_vapi_call(self, call_id: str) -> dict:
    """Initiate a VAPI call for a given call record."""
    db = self.get_db()
    call_service = CallService(db)

    try:
        # Convert string UUID to UUID object
        call_uuid = UUID(call_id)

        # Fetch call details with reminder eagerly loaded
        call = call_service.get(call_uuid)
        if not call:
            logger.error(f"Call {call_id} not found")
            raise NotFoundError(f"Call {call_id} not found")

        # Get the associated reminder
        reminder = call.reminder
        if not reminder:
            logger.error(f"Reminder for call {call_id} not found")
            raise NotFoundError(f"Reminder for call {call_id} not found")

        logger.info(
            f"Initiating VAPI call for reminder {reminder.id} - {reminder.title}"
        )

        # Initialize VAPI client
        vapi_client = VapiClient()

        # Initiate the call asynchronously
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        vapi_response = loop.run_until_complete(
            vapi_client.initiate_call(
                phone_number=reminder.phone_number,
                message=reminder.message,
            )
        )

        vapi_call_id = vapi_response.get("id")

        if not vapi_call_id:
            logger.error("VAPI response missing call ID")
            raise ValidationError("VAPI response missing call ID")

        call = call_service.update(
            call_uuid,
            {"vapi_call_id": vapi_call_id, "status": "in_progress"},
        )

        logger.info(
            f"Successfully initiated VAPI call {vapi_call_id} for reminder {reminder.id}"
        )

        return {
            "status": "success",
            "call_id": str(call.id),
            "vapi_call_id": vapi_call_id,
            "reminder_id": str(reminder.id),
        }

    except NotFoundError as e:
        logger.error(f"Resource not found: {str(e)}")
        call_service.update_call_status(call_uuid, "failed")
        raise

    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        call_service.update_call_status(call_uuid, "failed")
        raise

    except Exception as e:
        logger.error(f"Error initiating VAPI call: {str(e)}", exc_info=True)

        try:
            call_service.update_call_status(call_uuid, "failed")
        except Exception as update_error:
            logger.error(f"Failed to update call status: {str(update_error)}")

        raise self.retry(exc=e, countdown=60)


@celery_app.task(name="app.tasks.update_call_status")
def update_call_status(call_id: str, status: str) -> dict:
    """Update call status from VAPI webhooks."""
    db = SessionLocal()
    call_service = CallService(db)

    try:
        call_uuid = UUID(call_id)

        call = call_service.update_call_status(call_uuid, status)

        if not call:
            logger.error(f"Call {call_id} not found")
            raise NotFoundError(f"Call {call_id} not found")

        logger.info(f"Updated call {call_id} status to {status}")

        if status in ["completed", "failed"]:
            reminder_service = ReminderService(db)
            reminder = reminder_service.get(call.reminder_id)

            if reminder:
                reminder_status = "Completed" if status == "completed" else "Failed"
                reminder_service.update(call.reminder_id, {"status": reminder_status})
                logger.info(f"Updated reminder {call.reminder_id} status to {reminder_status}")

        return {
            "status": "success",
            "call_id": str(call.id),
            "new_status": status,
        }

    except Exception as e:
        logger.error(f"Error updating call status: {str(e)}", exc_info=True)
        raise

    finally:
        db.close()


@celery_app.task(name="app.tasks.process_scheduled_reminders")
def process_scheduled_reminders() -> dict:
    """Process reminders that are due for calling."""
    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        due_reminders = (
            db.query(Reminder)
            .filter(Reminder.scheduled_time <= now)
            .filter(Reminder.status == "Scheduled")
            .all()
        )

        logger.info(f"Found {len(due_reminders)} due reminders to process")

        processed_count = 0
        failed_count = 0

        for reminder in due_reminders:
            try:
                call_service = CallService(db)

                call_data = CallCreate(reminder_id=reminder.id)
                call = call_service.create(call_data)

                if call:
                    processed_count += 1
                    logger.info(f"Created call for reminder {reminder.id}")
                else:
                    failed_count += 1
                    reminder_service = ReminderService(db)
                    reminder_service.update(reminder.id, {"status": "Failed"})
                    logger.error(f"Failed to create call for reminder {reminder.id}")

            except Exception as e:
                failed_count += 1
                logger.error(f"Error processing reminder {reminder.id}: {str(e)}", exc_info=True)

                try:
                    reminder_service = ReminderService(db)
                    reminder_service.update(reminder.id, {"status": "Failed"})
                except Exception as update_error:
                    logger.error(f"Failed to update reminder status: {str(update_error)}")

        return {
            "status": "success",
            "processed": processed_count,
            "failed": failed_count,
            "total": len(due_reminders),
        }

    except Exception as e:
        logger.error(f"Error in process_scheduled_reminders: {str(e)}", exc_info=True)
        raise

    finally:
        db.close()
