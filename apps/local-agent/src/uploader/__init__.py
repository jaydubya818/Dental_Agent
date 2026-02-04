"""Cloud API uploader with retry logic."""

import gzip
import json
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential


class CloudUploader:
    """Upload sanitized schedule data to cloud API."""

    def __init__(self, api_url: str, api_key: str) -> None:
        self.api_url = api_url
        self.api_key = api_key

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=60),
    )
    async def upload(self, data: dict[str, Any]) -> dict[str, Any]:
        """Upload data to cloud API with retry logic."""
        # Compress payload
        json_data = json.dumps(data).encode("utf-8")
        compressed = gzip.compress(json_data)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.api_url,
                content=compressed,
                headers={
                    "Content-Type": "application/json",
                    "Content-Encoding": "gzip",
                    "X-API-Key": self.api_key,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
