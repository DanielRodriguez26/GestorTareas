# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Task
from ..schemas import TaskCreate, TaskUpdate, TaskResponse, MessageResponse

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"]
)


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task.

    - **title**: Task title (1-200 characters)
    - **description**: Optional description (max 1000 characters)
    - **is_completed**: Completion status (default: false)
    """
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records to return"),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all tasks with optional filtering.

    - **skip**: Pagination offset
    - **limit**: Maximum number of results (max 500)
    - **is_completed**: Filter by completion status (optional)
    """
    query = db.query(Task)

    # Apply filter if provided
    if is_completed is not None:
        query = query.filter(Task.is_completed == is_completed)

    # Order by creation date (newest first)
    query = query.order_by(Task.created_at.desc())

    tasks = query.offset(skip).limit(limit).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific task by ID.

    - **task_id**: ID of the task to retrieve
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing task.

    - **task_id**: ID of the task to update
    - All fields in TaskUpdate are optional (partial updates supported)
    """
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Update only provided fields (exclude unset fields)
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(task_id: int, db: Session = Depends(get_db)):
    """
    Toggle the completion status of a task.

    - **task_id**: ID of the task to toggle
    """
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Toggle completion status
    db_task.is_completed = False if db_task.is_completed else True

    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a task by ID.

    - **task_id**: ID of the task to delete
    """
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    db.delete(db_task)
    db.commit()
    return None
