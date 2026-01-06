"""Base service with common CRUD operations."""

from abc import ABC
from typing import Generic, TypeVar, Type, Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.base import TimestampedBase

# Type variables for generic types
ModelType = TypeVar("ModelType", bound=TimestampedBase)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseService(ABC, Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Abstract base service with common CRUD operations."""

    def __init__(self, model: Type[ModelType], db: Session):
        """
        Initialize base service.

        Args:
            model: The SQLAlchemy model class
            db: Database session
        """
        self.model = model
        self.db = db

    def create(self, obj_data: CreateSchemaType) -> ModelType:
        """Create a new object."""
        try:
            obj_dict = obj_data.model_dump()
            db_obj = self.model(**obj_dict)
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception:
            self.db.rollback()
            raise

    def get(self, obj_id: UUID) -> Optional[ModelType]:
        """Get an object by ID."""
        return self.db.query(self.model).filter(self.model.id == obj_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all objects with pagination."""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def update(self, obj_id: UUID, obj_data: UpdateSchemaType) -> Optional[ModelType]:
        """Update an object with partial data."""
        db_obj = self.get(obj_id)
        if not db_obj:
            return None

        try:
            update_data = obj_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_obj, field, value)

            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except Exception:
            self.db.rollback()
            raise

    def delete(self, obj_id: UUID) -> bool:
        """Delete an object by ID."""
        db_obj = self.get(obj_id)
        if not db_obj:
            return False

        try:
            self.db.delete(db_obj)
            self.db.commit()
            return True
        except Exception:
            self.db.rollback()
            raise
