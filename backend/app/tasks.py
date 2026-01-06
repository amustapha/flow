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
from app.core.config import settings
from app.core.database import SessionLocal
from app.services import CallService, ReminderService
from app.models.call import Call
from app.models.reminder import Reminder
from app.schemas.call import CallCreate, CallUpdate
from app.schemas.reminder import ReminderUpdate
from app.schemas.base import ReminderStatus, CallStatus
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
                phone_number_id=settings.VAPI_PHONE_NUMBER_ID or None,
            )
        )

        vapi_call_id = vapi_response.get("id")

        if not vapi_call_id:
            logger.error("VAPI response missing call ID")
            raise ValidationError("VAPI response missing call ID")

        call = call_service.update(
            call_uuid,
            CallUpdate(vapi_call_id=vapi_call_id, status=CallStatus.IN_PROGRESS),
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
        call_service.update_call_status(call_uuid, CallStatus.FAILED)
        raise

    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        call_service.update_call_status(call_uuid, CallStatus.FAILED)
        raise

    except Exception as e:
        logger.error(f"Error initiating VAPI call: {str(e)}", exc_info=True)

        try:
            call_service.update_call_status(call_uuid, CallStatus.FAILED)
        except Exception as update_error:
            logger.error(f"Failed to update call status: {str(update_error)}")

        raise self.retry(exc=e, countdown=60)


@celery_app.task(base=DatabaseTask, bind=True, name="app.tasks.update_call_status")
def update_call_status(self, call_id: str, status: str) -> dict:
    """Update call status from VAPI webhooks."""
    db = self.get_db()
    call_service = CallService(db)

    try:
        call_uuid = UUID(call_id)

        call = call_service.update_call_status(call_uuid, status)

        if not call:
            logger.error(f"Call {call_id} not found")
            raise NotFoundError(f"Call {call_id} not found")

        logger.info(f"Updated call {call_id} status to {status}")

        if status in [CallStatus.COMPLETED, CallStatus.FAILED]:
            reminder_service = ReminderService(db)
            reminder = reminder_service.get(call.reminder_id)

            if reminder:
                reminder_status = ReminderStatus.COMPLETED if status == CallStatus.COMPLETED else ReminderStatus.FAILED
                reminder_service.update(call.reminder_id, ReminderUpdate(status=reminder_status))
                logger.info(f"Updated reminder {call.reminder_id} status to {reminder_status}")

        return {
            "status": "success",
            "call_id": str(call.id),
            "new_status": status,
        }

    except Exception as e:
        logger.error(f"Error updating call status: {str(e)}", exc_info=True)
        raise


@celery_app.task(base=DatabaseTask, bind=True, name="app.tasks.process_scheduled_reminders")
def process_scheduled_reminders(self) -> dict:
    """Process reminders that are due for calling."""
    db = self.get_db()

    try:
        # Use naive UTC datetime for SQLite compatibility
        # SQLite stores datetimes as strings without timezone info
        now = datetime.now(timezone.utc).replace(tzinfo=None)

        due_reminders = (
            db.query(Reminder)
            .filter(Reminder.scheduled_time <= now)
            .filter(Reminder.status == ReminderStatus.SCHEDULED)
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
                    # Mark reminder as completed to prevent duplicate calls
                    reminder.status = ReminderStatus.COMPLETED
                    db.commit()
                    processed_count += 1
                    logger.info(f"Created call for reminder {reminder.id}")
                else:
                    failed_count += 1
                    reminder_service = ReminderService(db)
                    reminder_service.update(reminder.id, ReminderUpdate(status=ReminderStatus.FAILED))
                    logger.error(f"Failed to create call for reminder {reminder.id}")

            except Exception as e:
                failed_count += 1
                logger.error(f"Error processing reminder {reminder.id}: {str(e)}", exc_info=True)

                try:
                    reminder_service = ReminderService(db)
                    reminder_service.update(reminder.id, ReminderUpdate(status=ReminderStatus.FAILED))
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


@celery_app.task(base=DatabaseTask, bind=True, name="app.tasks.cleanup_in_progress_calls")
def cleanup_in_progress_calls(self) -> dict:
    """Check and update status of in-progress calls from Vapi."""
    db = self.get_db()

    try:
        # Find all calls with in_progress status
        in_progress_calls = (
            db.query(Call)
            .filter(Call.status == CallStatus.IN_PROGRESS)
            .filter(Call.vapi_call_id.isnot(None))
            .all()
        )

        logger.info(f"Found {len(in_progress_calls)} in-progress calls to check")

        updated_count = 0
        failed_count = 0

        vapi_client = VapiClient()
        reminder_service = ReminderService(db)

        for call in in_progress_calls:
            try:
                # Get call status from Vapi
                loop = asyncio.get_event_loop()
                if loop.is_closed():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)

                vapi_call = loop.run_until_complete(
                    vapi_client.get_call(call.vapi_call_id)
                )

                vapi_status = vapi_call.get("status")

                # Map Vapi status to our CallStatus
                if vapi_status == "ended":
                    ended_reason = vapi_call.get("endedReason", "")
                    # Check if call was successful or failed
                    if ended_reason in ["assistant-ended-call", "customer-ended-call"]:
                        new_status = CallStatus.COMPLETED
                    else:
                        new_status = CallStatus.FAILED

                    call.status = new_status
                    db.commit()
                    updated_count += 1
                    logger.info(f"Updated call {call.id} to {new_status} (reason: {ended_reason})")

                    # Update reminder status to match call status
                    reminder_status = (
                        ReminderStatus.COMPLETED
                        if new_status == CallStatus.COMPLETED
                        else ReminderStatus.FAILED
                    )
                    reminder_service.update(call.reminder_id, ReminderUpdate(status=reminder_status))
                    logger.info(f"Updated reminder {call.reminder_id} status to {reminder_status}")

            except Exception as e:
                failed_count += 1
                logger.error(f"Error checking call {call.id}: {str(e)}", exc_info=True)

        return {
            "status": "success",
            "checked": len(in_progress_calls),
            "updated": updated_count,
            "failed": failed_count,
        }

    except Exception as e:
        logger.error(f"Error in cleanup_in_progress_calls: {str(e)}", exc_info=True)
        raise
