"""Shared validators for Pydantic schemas."""

import re
from typing import Optional
import pytz

# Constants
E164_PHONE_PATTERN = r"^\+[1-9]\d{1,14}$"


def validate_e164_phone(value: str) -> str:
    """
    Validate phone number is in E.164 format.

    Args:
        value: Phone number string to validate

    Returns:
        The validated phone number

    Raises:
        ValueError: If phone number is not in E.164 format
    """
    if not re.match(E164_PHONE_PATTERN, value):
        raise ValueError(
            "Phone number must be in E.164 format (e.g., +14155552671)"
        )
    return value


def validate_e164_phone_optional(value: Optional[str]) -> Optional[str]:
    """
    Validate phone number if provided.

    Args:
        value: Optional phone number string to validate

    Returns:
        The validated phone number or None

    Raises:
        ValueError: If phone number is provided but not in E.164 format
    """
    if value is None:
        return value
    return validate_e164_phone(value)


def validate_timezone(value: str) -> str:
    """
    Validate timezone is a valid IANA timezone.

    Args:
        value: Timezone string to validate

    Returns:
        The validated timezone

    Raises:
        ValueError: If timezone is not valid
    """
    if value not in pytz.all_timezones:
        raise ValueError(f"Invalid timezone: {value}")
    return value


def validate_timezone_optional(value: Optional[str]) -> Optional[str]:
    """
    Validate timezone if provided.

    Args:
        value: Optional timezone string to validate

    Returns:
        The validated timezone or None

    Raises:
        ValueError: If timezone is provided but not valid
    """
    if value is None:
        return value
    return validate_timezone(value)
