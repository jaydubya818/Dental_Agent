"""Morning huddle schema."""

from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from schemas.risk import RiskFlag


class OpportunityPriority(str, Enum):
    """Revenue opportunity priority."""

    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RevenueOpportunity(BaseModel):
    """Revenue opportunity for unscheduled treatment."""

    patient_id: str = Field(..., description="Patient identifier")
    treatment_type: str = Field(..., description="Type of treatment (e.g., 'Crown')")
    estimated_value: float = Field(..., description="Estimated revenue value")
    priority: OpportunityPriority = Field(..., description="Priority level")
    talking_points: Optional[str] = Field(None, description="Suggested talking points")


class MorningHuddle(BaseModel):
    """Complete morning huddle output."""

    huddle_date: date = Field(..., description="Date of the huddle")
    practice_id: str = Field(..., description="Practice identifier")

    # Role-specific summaries
    clinical_summary: str = Field(..., description="Summary for dentists")
    hygiene_summary: str = Field(..., description="Summary for hygienists")
    admin_summary: str = Field(..., description="Summary for front desk/admin")

    # Risk and opportunity data
    risk_flags: list[RiskFlag] = Field(default_factory=list, description="All risk flags")
    opportunities: list[RevenueOpportunity] = Field(
        default_factory=list, description="Revenue opportunities"
    )

    # Metadata
    patient_count: int = Field(..., description="Number of patients today")
    generated_at: str = Field(..., description="When huddle was generated")
