"""Celery tasks for background processing."""

import logging
from uuid import UUID
from typing import Optional
import asyncio

from celery import Task
from sqlalchemy.orm import Session

from app.celery_app import celery_app
from app.clients import VapiClient
from app.core.database import SessionLocal
from app.services import CallService, ReminderService
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
            {"vapi_call_id": vapi_call_id},
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
        # Update call status to Failed
        call_service.update_call_status(call_uuid, "Failed")
        raise

    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        # Update call status to Failed
        call_service.update_call_status(call_uuid, "Failed")
        raise

    except Exception as e:
        logger.error(f"Error initiating VAPI call: {str(e)}", exc_info=True)

        # Update call status to Failed
        try:
            call_service.update_call_status(call_uuid, "Failed")
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

        if status in ["Completed", "Failed"]:
            reminder_service = ReminderService(db)
            reminder = reminder_service.get(call.reminder_id)

            if reminder:
                reminder_service.update(call.reminder_id, {"status": status})
                logger.info(f"Updated reminder {call.reminder_id} status to {status}")

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
