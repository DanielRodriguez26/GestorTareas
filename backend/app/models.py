# -*- coding: utf-8 -*-
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from datetime import datetime
from .database import Base


class Task(Base):
    """
    SQLAlchemy model for Task entity.
    Represents a task in the todo list application.
    """
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=True
    )

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', is_completed={self.is_completed})>"
