"""Morning huddle router."""

from datetime import date

from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.get("/{huddle_date}")
async def get_huddle(huddle_date: date) -> dict[str, str]:
    """Get morning huddle for a specific date."""
    # TODO: Implement huddle retrieval
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Huddle retrieval not yet implemented",
    )


@router.get("/{huddle_date}/summary/{role}")
async def get_role_summary(huddle_date: date, role: str) -> dict[str, str]:
    """Get role-specific summary."""
    # TODO: Implement role-specific summary
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Role summary not yet implemented",
    )
