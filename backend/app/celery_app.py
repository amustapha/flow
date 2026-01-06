"""Celery application configuration."""

import logging
from celery import Celery
from app.core.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery(
    "flow",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    result_expires=3600,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    task_default_retry_delay=60,
    task_max_retries=3,
    beat_schedule={
        "process-scheduled-reminders": {
            "task": "app.tasks.process_scheduled_reminders",
            "schedule": 60.0,
        },
    },
)

logger.info("Celery app initialized")
