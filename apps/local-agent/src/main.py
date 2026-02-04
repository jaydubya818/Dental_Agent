"""Local agent entry point."""

import asyncio
import sys
from datetime import datetime

import structlog

from src.config import settings
from src.extractors import get_extractor
from src.sanitizers import Sanitizer
from src.uploader import CloudUploader

logger = structlog.get_logger()


async def run_extraction() -> None:
    """Run the daily schedule extraction workflow."""
    logger.info("Starting daily extraction", timestamp=datetime.now().isoformat())

    try:
        # 1. Extract schedule from PMS
        extractor = get_extractor(settings.PMS_TYPE)
        raw_schedule = await extractor.extract_today()
        logger.info("Extracted schedule", patient_count=len(raw_schedule.get("appointments", [])))

        # 2. Sanitize PHI
        sanitizer = Sanitizer(settings.PRACTICE_SALT)
        sanitized_schedule = sanitizer.sanitize(raw_schedule)
        logger.info("Sanitized schedule data")

        # 3. Upload to cloud
        uploader = CloudUploader(
            api_url=settings.CLOUD_API_URL,
            api_key=settings.CLOUD_API_KEY,
        )
        result = await uploader.upload(sanitized_schedule)
        logger.info("Uploaded to cloud", status=result.get("status"))

    except Exception as e:
        logger.error("Extraction failed", error=str(e))
        raise


def main() -> None:
    """Main entry point."""
    print(f"Jerome Dental Local Agent v{__import__('src').__version__}")
    print(f"PMS Type: {settings.PMS_TYPE}")
    print(f"Cloud API: {settings.CLOUD_API_URL}")

    try:
        asyncio.run(run_extraction())
    except KeyboardInterrupt:
        print("\nInterrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
