# -*- coding: utf-8 -*-
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables with explicit UTF-8 encoding
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path, encoding='utf-8')

# PostgreSQL database configuration
# Format: postgresql://user:password@host:port/database
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "gestortareas")

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

# Fallback to SQLite for development if PostgreSQL is not configured
if os.getenv("USE_SQLITE", "false").lower() == "true":
    SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )
else:
    # Create engine with PostgreSQL configuration
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=10,  # Number of connections to maintain
        max_overflow=20,  # Max connections above pool_size
        echo=False  # Set to True for SQL query logging
    )

# Session configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency injection for database sessions.
    Ensures proper session lifecycle management.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
