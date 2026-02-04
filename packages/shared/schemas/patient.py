"""Patient appointment schema."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PatientAppt(BaseModel):
    """Patient appointment data structure."""

    id: str = Field(..., description="Unique appointment ID")
    time_slot: datetime = Field(..., description="Appointment time")
    patient_name: str = Field(..., description="Tokenized patient name")
    procedure_code: str = Field(..., description="Procedure code (e.g., D0120)")
    provider_id: str = Field(..., description="Provider/dentist ID")
    notes: Optional[str] = Field(None, description="Appointment notes")

    # Optional fields for risk assessment
    age_range: Optional[str] = Field(None, description="Age range (e.g., '60-70')")
    medical_alerts: Optional[list[str]] = Field(None, description="Medical alert flags")
    balance: Optional[float] = Field(None, description="Outstanding balance")
    no_show_count: Optional[int] = Field(None, description="No-show count in last 12 months")


class SchedulePayload(BaseModel):
    """Schedule data payload from local agent."""

    practice_id: str = Field(..., description="Practice identifier")
    date: str = Field(..., description="Schedule date (YYYY-MM-DD)")
    appointments: list[PatientAppt] = Field(..., description="List of appointments")
    extraction_timestamp: datetime = Field(..., description="When data was extracted")
