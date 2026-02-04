"""PHI sanitization utilities."""

import hashlib
import uuid
from typing import Any


class Sanitizer:
    """Sanitize PHI before cloud transmission."""

    def __init__(self, practice_salt: str) -> None:
        self.practice_salt = practice_salt
        self._token_map: dict[str, str] = {}

    def _hash_value(self, value: str) -> str:
        """Hash a value with practice-specific salt."""
        salted = f"{self.practice_salt}:{value}"
        return hashlib.sha256(salted.encode()).hexdigest()[:16]

    def _tokenize_name(self, name: str) -> str:
        """Replace name with anonymous token."""
        if name not in self._token_map:
            self._token_map[name] = f"PT-{uuid.uuid4().hex[:8].upper()}"
        return self._token_map[name]

    def sanitize(self, data: dict[str, Any]) -> dict[str, Any]:
        """Sanitize all PHI in the data."""
        sanitized = data.copy()

        if "appointments" in sanitized:
            for apt in sanitized["appointments"]:
                # Tokenize patient name
                if "patient_name" in apt:
                    apt["patient_name"] = self._tokenize_name(apt["patient_name"])

                # Hash SSN if present
                if "ssn" in apt:
                    apt["ssn"] = self._hash_value(apt["ssn"])

                # Hash insurance ID if present
                if "insurance_id" in apt:
                    apt["insurance_id"] = self._hash_value(apt["insurance_id"])

                # Convert birthdate to age range
                if "birthdate" in apt:
                    # TODO: Calculate age range
                    del apt["birthdate"]

        return sanitized

    def get_token_map(self) -> dict[str, str]:
        """Get the token mapping for de-tokenization."""
        return self._token_map.copy()
