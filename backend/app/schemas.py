# -*- coding: utf-8 -*-
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    """Base schema for Task with common attributes."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Optional task description")
    is_completed: bool = Field(default=False, description="Task completion status")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


class TaskUpdate(BaseModel):
    """
    Schema for updating a task.
    All fields are optional to support partial updates.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    is_completed: Optional[bool] = None


class TaskResponse(TaskBase):
    """
    Schema for task responses.
    Includes all fields including database-generated ones.
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    """Schema for list of tasks with metadata."""
    tasks: list[TaskResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    """Generic message response schema."""
    message: str
