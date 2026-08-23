import uuid
from fastapi import APIRouter, HTTPException
from typing import List
from backend_api.database import db
from backend_api.models.schemas import MegaBlockCreate, MegaBlockResponse, TrainDiversionResponse
from backend_api.services.websocket_hub import ws_hub

router = APIRouter(prefix="/mega-blocks", tags=["Mega Blocks & Passenger Advisories"])

@router.get("/upcoming", response_model=List[MegaBlockResponse])
async def list_upcoming_mega_blocks():
    """List all scheduled mega blocks with timings, purposes, and alternative transport routes."""
    query = "SELECT * FROM mega_blocks WHERE status IN ('UPCOMING', 'ACTIVE') ORDER BY start_time ASC"
    rows = await db.fetch_all(query)
    return [
        MegaBlockResponse(
            mega_block_id=r["mega_block_id"],
            division_id=r["division_id"],
            section_id=r["section_id"],
            line_affected=r["line_affected"],
            start_time=str(r["start_time"]),
            end_time=str(r["end_time"]),
            headline=r["headline"],
            purpose=r["purpose"],
            status=r.get("status", "UPCOMING"),
            alternative_transport_notes=r.get("alternative_transport_notes")
        ) for r in rows
    ]

@router.post("", response_model=MegaBlockResponse)
async def create_mega_block(mb: MegaBlockCreate):
    """Register a new planned maintenance mega block (e.g. Sunday suburban block)."""
    mb_id = f"MB_{uuid.uuid4().hex[:6].upper()}"
    insert_query = """
    INSERT INTO mega_blocks (mega_block_id, division_id, section_id, line_affected, 
                            start_time, end_time, headline, purpose, alternative_transport_notes, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'UPCOMING')
    """
    await db.execute(
        insert_query,
        mb_id, mb.division_id, mb.section_id, mb.line_affected, mb.start_time,
        mb.end_time, mb.headline, mb.purpose, mb.alternative_transport_notes
    )

    # Create advisory alert
    alert_id = f"ALERT_MB_{uuid.uuid4().hex[:6].upper()}"
    alert_query = """
    INSERT INTO broadcast_alerts (alert_id, alert_type, severity, headline, body_text, 
                                 source_reference_id, affected_section_id)
    VALUES ($1, 'MEGA_BLOCK_ADVISORY', 'HIGH', $2, $3, $4, $5)
    """
    body = f"Mega Block planned from {mb.start_time} to {mb.end_time}. Purpose: {mb.purpose}. Alternative transport: {mb.alternative_transport_notes or 'Check revised schedules'}."
    await db.execute(alert_query, alert_id, mb.headline, body, mb_id, mb.section_id)

    response_data = MegaBlockResponse(
        mega_block_id=mb_id,
        status="UPCOMING",
        **mb.model_dump()
    )

    await ws_hub.broadcast("MEGA_BLOCK_NOTICE", response_data.model_dump())
    return response_data

@router.get("/{mega_block_id}/diversions", response_model=List[TrainDiversionResponse])
async def list_block_train_diversions(mega_block_id: str):
    """List train cancellations, diversions, or short-terminations caused by this mega block."""
    query = "SELECT * FROM train_diversions WHERE source_event_id = $1"
    rows = await db.fetch_all(query, mega_block_id)
    return [
        TrainDiversionResponse(
            diversion_id=int(r["diversion_id"]),
            source_event_id=r["source_event_id"],
            train_number=r["train_number"],
            action_type=r["action_type"],
            original_route_summary=r.get("original_route_summary"),
            diverted_via_stations=r.get("diverted_via_stations"),
            public_notice=r.get("public_notice")
        ) for r in rows
    ]
