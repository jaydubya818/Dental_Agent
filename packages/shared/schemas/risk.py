"""Risk flag schema."""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    """Risk severity level."""

    CRITICAL = "CRITICAL"
    WARN = "WARN"
    INFO = "INFO"


class RiskCategory(str, Enum):
    """Risk category."""

    MEDICAL = "MEDICAL"
    FINANCIAL = "FINANCIAL"
    SCHEDULING = "SCHEDULING"


class RiskFlag(BaseModel):
    """Risk flag for a patient or appointment."""

    level: RiskLevel = Field(..., description="Severity level")
    category: RiskCategory = Field(..., description="Risk category")
    message: str = Field(..., description="Human-readable risk description")
    patient_id: Optional[str] = Field(None, description="Associated patient ID")
    appointment_id: Optional[str] = Field(None, description="Associated appointment ID")
    rule_id: Optional[str] = Field(None, description="ID of the rule that triggered this flag")
