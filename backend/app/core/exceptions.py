"""Custom exceptions for the Flow application."""


class FlowException(Exception):
    """Base exception for Flow application."""

    pass


class NotFoundError(FlowException):
    """Exception raised when a resource is not found."""

    pass


class ValidationError(FlowException):
    """Exception raised when validation fails."""

    pass


class ConflictError(FlowException):
    """Exception raised when there is a resource conflict."""

    pass
