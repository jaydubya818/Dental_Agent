"""PMS data extractors."""

from typing import Protocol


class Extractor(Protocol):
    """Base extractor protocol."""

    async def extract_today(self) -> dict:
        """Extract today's schedule."""
        ...


class CSVExtractor:
    """Extract schedule from CSV file."""

    def __init__(self, csv_path: str) -> None:
        self.csv_path = csv_path

    async def extract_today(self) -> dict:
        """Extract today's schedule from CSV."""
        # TODO: Implement CSV parsing
        return {"appointments": [], "date": None}


class DentrixExtractor:
    """Extract schedule from Dentrix via ODBC."""

    def __init__(self, dsn: str) -> None:
        self.dsn = dsn

    async def extract_today(self) -> dict:
        """Extract today's schedule from Dentrix."""
        # TODO: Implement Dentrix ODBC extraction
        return {"appointments": [], "date": None}


class EaglesoftExtractor:
    """Extract schedule from Eaglesoft via screen scraping."""

    async def extract_today(self) -> dict:
        """Extract today's schedule via Playwright."""
        # TODO: Implement screen scraping
        return {"appointments": [], "date": None}


def get_extractor(pms_type: str) -> Extractor:
    """Get the appropriate extractor for the PMS type."""
    from src.config import settings

    extractors = {
        "csv": lambda: CSVExtractor(settings.CSV_PATH),
        "dentrix": lambda: DentrixExtractor(settings.DENTRIX_DSN),
        "eaglesoft": lambda: EaglesoftExtractor(),
    }

    factory = extractors.get(pms_type.lower())
    if not factory:
        raise ValueError(f"Unknown PMS type: {pms_type}")

    return factory()
