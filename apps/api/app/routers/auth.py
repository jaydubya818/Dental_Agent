"""Authentication router."""

from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.post("/login")
async def login() -> dict[str, str]:
    """User login endpoint."""
    # TODO: Implement JWT authentication
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Authentication not yet implemented",
    )


@router.post("/refresh")
async def refresh_token() -> dict[str, str]:
    """Refresh access token."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not yet implemented",
    )


@router.post("/logout")
async def logout() -> dict[str, str]:
    """User logout."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Logout not yet implemented",
    )
