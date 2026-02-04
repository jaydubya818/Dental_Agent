"""Chat Q&A router."""

from fastapi import APIRouter, HTTPException, status

router = APIRouter()


@router.post("/query")
async def chat_query() -> dict[str, str]:
    """Process a chat query about today's schedule."""
    # TODO: Implement chat endpoint with LLM
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Chat not yet implemented",
    )
