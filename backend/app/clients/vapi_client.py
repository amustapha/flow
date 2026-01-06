"""VAPI API client for initiating voice calls."""

import logging
from typing import Dict, Any, Optional
import httpx

from app.core.config import settings
from app.core.exceptions import ValidationError


logger = logging.getLogger(__name__)


class VapiClient:
    """Client for interacting with VAPI API."""

    def __init__(self, api_key: Optional[str] = None, api_url: Optional[str] = None):
        self.api_key = api_key or settings.VAPI_API_KEY
        self.api_url = api_url or settings.VAPI_API_URL

        if not self.api_key:
            raise ValidationError("VAPI_API_KEY is not configured")

        if not self.api_url:
            raise ValidationError("VAPI_API_URL is not configured")

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def initiate_call(
        self,
        phone_number: str,
        message: str,
        assistant_id: Optional[str] = None,
        phone_number_id: Optional[str] = None,
        assistant_overrides: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Initiate an outbound voice call via VAPI."""
        if not phone_number:
            raise ValidationError("phone_number is required")

        if not message:
            raise ValidationError("message is required")

        payload: Dict[str, Any] = {
            "customer": {
                "number": phone_number,
            }
        }

        if assistant_id:
            payload["assistantId"] = assistant_id
            if assistant_overrides:
                payload["assistantOverrides"] = assistant_overrides
        else:
            payload["assistant"] = {
                "firstMessage": message,
                "firstMessageMode": "assistant-speaks-first",

                "model": {
                    "provider": settings.VAPI_MODEL_PROVIDER,
                    "model": settings.VAPI_MODEL_NAME,
                    "temperature": settings.VAPI_MODEL_TEMPERATURE,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a voice reminder assistant. Your job is to deliver the reminder message "
                                "to the user clearly. After delivering the message, ask if they have any questions "
                                "or need the reminder repeated. Be friendly, concise, and helpful. "
                                "If they confirm they understood, wish them a good day and end the call politely."
                            ),
                        }
                    ],
                },
                "voice": {
                    "provider": settings.VAPI_VOICE_PROVIDER,
                    "voiceId": settings.VAPI_VOICE_ID,
                },
                "voicemailDetection": {
                    "provider": "twilio",
                    "enabled": False,
                },
            }

        if phone_number_id:
            payload["phoneNumberId"] = phone_number_id

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"Creating VAPI call to {phone_number}")

            try:
                response = await client.post(
                    f"{self.api_url}/call",
                    headers=self._get_headers(),
                    json=payload,
                )
                response.raise_for_status()

                result = response.json()
                logger.info(f"VAPI call created successfully: {result.get('id')}")

                return result

            except httpx.HTTPStatusError as e:
                logger.error(f"VAPI API error: {e.response.status_code} - {e.response.text}")
                raise
            except httpx.HTTPError as e:
                logger.error(f"HTTP error during VAPI call creation: {str(e)}")
                raise

    async def get_call(self, call_id: str) -> Dict[str, Any]:
        """Get details of a specific call."""
        if not call_id:
            raise ValidationError("call_id is required")

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"Fetching VAPI call {call_id}")

            try:
                response = await client.get(
                    f"{self.api_url}/call/{call_id}",
                    headers=self._get_headers(),
                )
                response.raise_for_status()

                return response.json()

            except httpx.HTTPStatusError as e:
                logger.error(f"VAPI API error: {e.response.status_code} - {e.response.text}")
                raise
            except httpx.HTTPError as e:
                logger.error(f"HTTP error fetching VAPI call: {str(e)}")
                raise

    async def cancel_call(self, call_id: str) -> Dict[str, Any]:
        """Cancel an ongoing or scheduled call."""
        if not call_id:
            raise ValidationError("call_id is required")

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"Cancelling VAPI call {call_id}")

            try:
                response = await client.delete(
                    f"{self.api_url}/call/{call_id}",
                    headers=self._get_headers(),
                )
                response.raise_for_status()

                logger.info(f"VAPI call {call_id} cancelled successfully")
                return response.json()

            except httpx.HTTPStatusError as e:
                logger.error(f"VAPI API error: {e.response.status_code} - {e.response.text}")
                raise
            except httpx.HTTPError as e:
                logger.error(f"HTTP error cancelling VAPI call: {str(e)}")
                raise
