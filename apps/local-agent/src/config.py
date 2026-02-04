"""Local agent configuration."""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Local agent settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # PMS Configuration
    PMS_TYPE: Literal["dentrix", "eaglesoft", "csv"] = "csv"
    DENTRIX_DSN: str = ""  # ODBC connection string
    CSV_PATH: str = "./data/schedule.csv"

    # Cloud API
    CLOUD_API_URL: str = "http://localhost:8000/api/v1/schedule/ingest"
    CLOUD_API_KEY: str = ""

    # Security
    PRACTICE_SALT: str = "change-me-unique-per-practice"

    # Caching
    CACHE_DAYS: int = 7
    SQLITE_PATH: str = "./data/cache.db"

    # Scheduling
    EXTRACTION_HOUR: int = 6  # 6 AM
    EXTRACTION_MINUTE: int = 0


@lru_cache
def get_settings() -> Settings:
    """Get cached settings."""
    return Settings()


settings = get_settings()
