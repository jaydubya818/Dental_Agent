"""Schedule ingestion router."""

from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.post("/ingest")
async def ingest_schedule() -> dict[str, str]:
    """Receive schedule data from local agent."""
    # TODO: Implement schedule ingestion
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Schedule ingestion not yet implemented",
    )
