"""HuddleSupervisor - Master LangGraph agent for morning huddle generation."""

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END


class HuddleState(TypedDict):
    """State passed between agent nodes."""

    schedule_data: dict  # Raw schedule from local agent
    normalized_schedule: list  # Cleaned patient appointments
    risk_flags: list  # Identified risks
    opportunities: list  # Revenue opportunities
    clinical_summary: str  # Dentist summary
    hygiene_summary: str  # Hygienist summary
    admin_summary: str  # Admin summary
    errors: list  # Any errors during processing


def create_huddle_graph() -> StateGraph:
    """Create the HuddleSupervisor state graph."""
    graph = StateGraph(HuddleState)

    # Add nodes (to be implemented in separate files)
    # graph.add_node("ingestion", ingestion_node)
    # graph.add_node("risk_scan", risk_scan_node)
    # graph.add_node("revenue", revenue_node)
    # graph.add_node("writer", writer_node)

    # Add edges
    # graph.add_edge("ingestion", "risk_scan")
    # graph.add_edge("risk_scan", "revenue")
    # graph.add_edge("revenue", "writer")
    # graph.add_edge("writer", END)

    # Set entry point
    # graph.set_entry_point("ingestion")

    return graph


# Compiled graph (to be used after all nodes are implemented)
# huddle_supervisor = create_huddle_graph().compile()
