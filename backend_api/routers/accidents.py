import uuid
from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from backend_api.database import db
from backend_api.models.schemas import AccidentReportCreate, AccidentResponse, AccidentStatusUpdate
from backend_api.services.websocket_hub import ws_hub

router = APIRouter(prefix="/accidents", tags=["Safety, Accidents & Emergency Feed"])

@router.post("/report", response_model=AccidentResponse)
async def report_accident(report: AccidentReportCreate):
    """
    Emergency API for field staff, loco pilots, or control room to report an accident.
    Automatically closes the affected track section and broadcasts emergency alerts.
    """
    acc_id = f"ACC_{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:4].upper()}"
    insert_query = """
    INSERT INTO accidents (accident_id, train_number, section_id, latitude, longitude, 
                          nearest_station_code, accident_type, severity, casualties_reported, 
                          injuries_reported, reported_by, root_cause_summary, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'REPORTED')
    """
    await db.execute(
        insert_query,
        acc_id, report.train_number, report.section_id, report.latitude, report.longitude,
        report.nearest_station_code, report.accident_type, report.severity,
        report.casualties_reported, report.injuries_reported, report.reported_by,
        report.root_cause_summary
    )

    # Automatically set track section to EMERGENCY_CLOSURE
    status_query = "UPDATE track_sections SET current_status = 'EMERGENCY_CLOSURE', status_reason = $1 WHERE section_id = $2"
    await db.execute(status_query, f"Emergency Closure: {report.accident_type} reported (ID: {acc_id})", report.section_id)

    # Create Broadcast Alert
    alert_id = f"ALERT_EMG_{uuid.uuid4().hex[:6].upper()}"
    alert_query = """
    INSERT INTO broadcast_alerts (alert_id, alert_type, severity, headline, body_text, 
                                 source_reference_id, affected_section_id, geo_center_lat, geo_center_lon)
    VALUES ($1, 'ACCIDENT_EMERGENCY', 'CRITICAL', $2, $3, $4, $5, $6, $7)
    """
    headline = f"EMERGENCY: Accident ({report.accident_type}) reported on {report.section_id}"
    body_text = f"Accident involving train {report.train_number or 'N/A'}. Emergency relief and NDRF teams dispatched. Track section closed."
    await db.execute(alert_query, alert_id, headline, body_text, acc_id, report.section_id, report.latitude, report.longitude)

    response_data = AccidentResponse(
        accident_id=acc_id,
        status="REPORTED",
        reported_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        relief_train_dispatched=False,
        **report.model_dump()
    )

    # Real-time WebSocket Broadcast
    await ws_hub.broadcast("EMERGENCY_ACCIDENT_ALERT", response_data.model_dump())

    return response_data

@router.get("/active", response_model=List[AccidentResponse])
async def list_active_accidents():
    """Retrieve feed of active accidents requiring rescue, relief, or track restoration."""
    query = "SELECT * FROM accidents WHERE status != 'CLEARED_REOPENED' ORDER BY reported_at DESC"
    rows = await db.fetch_all(query)
    return [
        AccidentResponse(
            accident_id=r["accident_id"],
            train_number=r.get("train_number"),
            section_id=r["section_id"],
            latitude=float(r["latitude"]),
            longitude=float(r["longitude"]),
            nearest_station_code=r.get("nearest_station_code"),
            accident_type=r["accident_type"],
            severity=r.get("severity", "MAJOR"),
            casualties_reported=int(r.get("casualties_reported", 0)),
            injuries_reported=int(r.get("injuries_reported", 0)),
            reported_by=r["reported_by"],
            root_cause_summary=r.get("root_cause_summary"),
            status=r.get("status", "REPORTED"),
            reported_at=str(r.get("reported_at", "")),
            relief_train_dispatched=bool(r.get("relief_train_dispatched", False))
        ) for r in rows
    ]

@router.put("/{accident_id}/status")
async def update_accident_status(accident_id: str, update: AccidentStatusUpdate):
    """Update ongoing rescue/restoration status. When cleared, automatically re-opens the section."""
    query = "UPDATE accidents SET status = $1 WHERE accident_id = $2"
    await db.execute(query, update.status, accident_id)

    if update.status == "CLEARED_REOPENED":
        # Re-open section
        fetch_sec = "SELECT section_id FROM accidents WHERE accident_id = $1"
        r = await db.fetch_one(fetch_sec, accident_id)
        if r:
            reopen_query = "UPDATE track_sections SET current_status = 'AVAILABLE', status_reason = 'Section inspected and declared track fit' WHERE section_id = $1"
            await db.execute(reopen_query, r["section_id"])

    await ws_hub.broadcast("ACCIDENT_STATUS_UPDATE", {"accident_id": accident_id, "status": update.status})
    return {"status": "success", "accident_id": accident_id, "new_status": update.status}
